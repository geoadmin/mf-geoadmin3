#!/usr/bin/env groovy
import groovy.json.JsonSlurperClassic
import groovy.json.JsonOutput

node(label: 'jenkins-slave') {
  def stdout
  def s3VersionPath
  def e2eTargetUrl
  def deployTarget = 'int'

  // If it's a branch
  def deployGitBranch = env.BRANCH_NAME
  def namedBranch = false

  // If it's a PR
  if (env.CHANGE_ID) {
    deployGitBranch = env.CHANGE_BRANCH
    namedBranch = true
  }
  
  // Project legacy/mf-geoadmin3 --> mf-geoadmin3 bucket
  // Project mvt                 --> mf-geoadmin4 bucket
  def project = 'mf-geoadmin3'
  if (env.CHANGE_TARGET !='master') {
     project = 'mvt'
  }

  // from jenkins-shared-librairies 
  utils.abortPreviousBuilds()

  try { 
    stage('Checkout') { 
      checkout scm
    }
    
    stage('env') {
      sh 'make env'
    }

    stage('Lint') {
      sh 'make lint'
    }

    // Very important for greenkeeper branches
    stage('Update js libs') {
      sh 'make libs'
    }

    stage('Build') {
      sh 'make ' + deployTarget + ' DEPLOY_GIT_BRANCH=' + deployGitBranch + ' NAMED_BRANCH=' + namedBranch
    }
    // Different project --> different targets
    stage('Deploy to int') {
      echo 'Building project:'
      echo project
      stdout = sh returnStdout: true, script: 'make s3copybranch PROJECT='+ project +   ' DEPLOY_TARGET=' + deployTarget + ' DEPLOY_GIT_BRANCH=' + deployGitBranch + ' NAMED_BRANCH=' + namedBranch
      echo stdout
      def lines = stdout.readLines()
      deployedVersion = lines.get(lines.size()-5)
      s3VersionPath = lines.get(lines.size()-3)
      e2eTargetUrl = lines.get(lines.size()-1)
    }  
     
    if (namedBranch) {
      // Add the test link in the PR
      stage('Publish test link') {
        def url = 'https://api.github.com/repos/geoadmin/mf-geoadmin3/pulls/' + env.CHANGE_ID
        def testLink = '<jenkins>[Test link](' + e2eTargetUrl + ')</jenkins>'
        def response = httpRequest acceptType: 'APPLICATION_JSON',
                                   consoleLogResponseBody: true,
                                   responseHandle: 'LEAVE_OPEN',
                                   url: url
        if (response.status == 200) {

          echo 'Get personnal access token'
          def userpass 
          withCredentials([usernameColonPassword(credentialsId: 'iwibot-admin-user-github-token', variable: 'USERPASS')]) {
            userpass = sh returnStdout: true, script: 'echo $USERPASS'
          }
          def token = 'token ' + userpass.split(':')[1].trim()
          
          echo 'Parse the json'
          // Don't put instance of JsonSlurperClassic in a variable it will trigger a java.io.NotSerializableException
          def result = new JsonSlurperClassic().parseText(response.content)

          echo 'Remove the existing links if exists'
          // If the PR is modified by a user \n\n becomes \r\n\r\n
          def body = result.body.replaceAll('((\\r)?\\n){2}<jenkins>.*</jenkins>', '')

          echo 'Add test link'
          body = body + '\n\n' + testLink
          def bodyEscaped = JsonOutput.toJson(body)
          
          echo 'Body sent: ' + bodyEscaped
          httpRequest acceptType: 'APPLICATION_JSON',
                      consoleLogResponseBody: false,
                      customHeaders: [[maskValue: true, name: 'Authorization', value: token]], 
                      httpMode: 'POST',
                      requestBody: '{"body": ' + bodyEscaped + '}',
                      responseHandle: 'NONE',
                      url: url
        }
        response.close()
      }
    }

    stage('Test') {
      parallel (
        'debug': {
          sh 'make testdebug'
        },
        'release': {
          sh 'make testrelease'
        }
      )
    }

    stage('Test e2e') {
      def target = 'make teste2e E2E_TARGETURL=' + e2eTargetUrl
      parallel (
        'Firefox': {
          sh target + ' E2E_BROWSER=firefox'
        },
        'Chrome': {
          sh target + ' E2E_BROWSER=chrome'
        },
        'Safari': {
          sh target + ' E2E_BROWSER=safari'
        }
      )

      // Activate the new version if tests succceed
      sh 'echo "yes" | make DEPLOY_GIT_BRANCH=' + deployGitBranch + ' VERSION=' + deployedVersion + ' s3activate' + deployTarget
    }

  } catch(e) {
    throw e;

  } finally {
    // TODO: cleanup: verify if the env variable is still needed
    sh 'make DEPLOY_GIT_BRANCH=' + deployGitBranch  + ' cleanall'
  }
}
