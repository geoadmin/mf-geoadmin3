#!/usr/bin/env groovy
import groovy.json.JsonSlurperClassic
import groovy.json.JsonOutput
import hudson.model.*

node(label: 'jenkins-slave') {
  def stdout
  def s3VersionPath
  def e2eTargetUrl

  // If it's a branch
  def deployGitBranch = env.BRANCH_NAME
  def isGitMaster = deployGitBranch == 'mvt_clean' || deployGitBranch == 'master'

  // If it's a PR
  if (env.CHANGE_ID) {
    deployGitBranch = env.CHANGE_BRANCH
  }
  
  // Two projects:
  // Project legacy/mf-geoadmin3: branch 'master'                --> s3_mf-geoadmin3_(dev|int|prod)_dublin  bucket
  // Project mvt/vib2d (vector tiles demo): branch 'mvt_clean'   --> s3_mf_geoadmin4_(int|prod)_dublin  bucket
  def project
  
  if (deployGitBranch == 'mvt_clean' || (env.CHANGE_TARGET != null && env.CHANGE_TARGET == 'mvt_clean' )) {
    project = 'mvt'
  } else if  (deployGitBranch == 'master' || (env.CHANGE_TARGET != null && env.CHANGE_TARGET == 'master' )) {
    project = 'mf-geoadmin3'
  } else {
    error 'Fatal error: unknown project. Aborting.'
  }

  // from jenkins-shared-librairies 
  utils.abortPreviousBuilds()

  try {

    stage('print env') {
      sh 'printenv'
    }

    stage('get payload') {
      def payloadString = currentBuild.rawBuild.buildVariableResolver.resolve("payload")
      def payloadObject = new groovy.json.JsonSlurper().parseText(payloadString)
      echo payloadObject
      
    }

    stage('Checkout') {
      checkout scm
    }

    // stage('env') {
    //   sh 'make env'
    //   echo sh(returnStdout: true, script: 'env')
    // }

    // stage('Lint') {
    //   sh 'make lint'
    // }

    // // Very important for greenkeeper branches
    // stage('Update js libs') {
    //   sh 'make libs'
    // }

    // stage('Build') {
    //   sh 'make build GIT_BRANCH=' + deployGitBranch
    // }

    // // Different project --> different targets
    // stage('Deploy int/prod') {
    //   echo 'Deploying  project <' + project + '>'
    //   parallel (
    //     'int': {
    //       // deploy anything to int (branches for PR, or master for deploy day)
    //       stdout = sh returnStdout: true, script: 'make s3deploy DEPLOY_TARGET=int PROJECT='+ project + ' DEPLOY_GIT_BRANCH=' + deployGitBranch
    //       echo stdout
    //       def lines = stdout.readLines()
    //       deployedVersion = lines.get(lines.size() - 7)
    //       s3VersionPath = lines.get(lines.size() - 5)
    //       e2eTargetUrl = lines.get(lines.size() - 3)
    //     },
    //     'prod': {
    //       // Both projects 'mvt' and 'mf-geoadmin3' are deployable to <prod>,
    //       // but only the 'master' branches for both projects ('master' for mf-geoadmin3, 'mvt_clean' for mvt/vib2d) 
    //       if (isGitMaster) {
    //         stdout = sh returnStdout: true, script: 'make s3copybranch PROJECT='+ project + ' DEPLOY_TARGET=prod'
    //         echo stdout
    //       } else {
    //         echo 'Won\'t deploy branch <' + deployGitBranch + '> to production. Skipping stage'
    //       }
    //     }
    //   )
    // }
    // //It's a PR
    // if (env.CHANGE_ID) {
    //   // Add the test link in the PR on GitHub
    //   stage('Publish test link') {
    //     def url = 'https://api.github.com/repos/geoadmin/mf-geoadmin3/pulls/' + env.CHANGE_ID
    //     def testLink = '<jenkins>[Test link](' + e2eTargetUrl + ')</jenkins>'
    //     def response = httpRequest acceptType: 'APPLICATION_JSON',
    //                                consoleLogResponseBody: true,
    //                                responseHandle: 'LEAVE_OPEN',
    //                                url: url
    //     if (response.status == 200) {

    //       echo 'Get personnal access token'
    //       def userpass 
    //       withCredentials([usernameColonPassword(credentialsId: 'iwibot-admin-user-github-token', variable: 'USERPASS')]) {
    //         userpass = sh returnStdout: true, script: 'echo $USERPASS'
    //       }
    //       def token = 'token ' + userpass.split(':')[1].trim()
          
    //       echo 'Parse the json'
    //       // Don't put instance of JsonSlurperClassic in a variable it will trigger a java.io.NotSerializableException
    //       def result = new JsonSlurperClassic().parseText(response.content)

    //       echo 'Remove the existing links if exists'
    //       // If the PR is modified by a user \n\n becomes \r\n\r\n
    //       def body = result.body.replaceAll('((\\r)?\\n){2}<jenkins>.*</jenkins>', '')

    //       echo 'Add test link'
    //       body = body + '\n\n' + testLink
    //       def bodyEscaped = JsonOutput.toJson(body)
          
    //       echo 'Body sent: ' + bodyEscaped
    //       httpRequest acceptType: 'APPLICATION_JSON',
    //                   consoleLogResponseBody: false,
    //                   customHeaders: [[maskValue: true, name: 'Authorization', value: token]], 
    //                   httpMode: 'POST',
    //                   requestBody: '{"body": ' + bodyEscaped + '}',
    //                   responseHandle: 'NONE',
    //                   url: url
    //     }
    //     response.close()
    //   }
    // }

    // stage('Test') {
    //   parallel (
    //     'debug': {
    //       sh 'make testdebug'
    //     },
    //     'release': {
    //       sh 'make testrelease'
    //     }
    //   )
    // }

    // stage('Test e2e') {
    //   def target = 'make teste2e E2E_TARGETURL=' + e2eTargetUrl
    //   parallel (
    //     'Firefox': {
    //       sh target + ' E2E_BROWSER=firefox'
    //     },
    //     'Chrome': {
    //       sh target + ' E2E_BROWSER=chrome'
    //     },
    //     'Safari': {
    //       sh target + ' E2E_BROWSER=safari'
    //     }
    //   )
    // }
    // // Activate all branches only on <int> 
    // stage('Activate int') {
    //   echo 'Project <' + project + '>'
    //   echo 'Activating the new version <' + deployedVersion + ' of branch  <' + deployGitBranch + '>'
    //   sh 'PROJECT=' + project + ' make s3activateint DEPLOY_GIT_BRANCH=' + deployGitBranch + ' VERSION=' + deployedVersion + ' FORCE=true'
    // }

  } catch(e) {
    throw e;

  } finally {
    // TODO: cleanup: verify if the env variable is still needed
    sh 'make DEPLOY_GIT_BRANCH=' + deployGitBranch  + ' cleanall'
  }
}
