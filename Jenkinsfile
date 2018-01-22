#!/usr/bin/env groovy

node(label: 'jenkins-slave') {
  def stdout
  def s3VersionPath
  def e2eTargetUrl

  // If it's master
  def deployGitBranch = 'master'
  def namedBranch = false

  // If it's a PR
  if (env.ghprbSourceBranch) {
    deployGitBranch = env.ghprbSourceBranch
    namedBranch = true
  }

  try {
    checkout scm
    
    stage('Lint') {
      sh 'make lint'
    }

    stage('Build') {
      sh 'make debug release'
    }

    stage('Test') {
      sh 'make testdebug testrelease'
    }
    
    stage('Deploy') {
      stdout = sh returnStdout: true, script: 'make DEPLOY_GIT_BRANCH=' + deployGitBranch + ' NAMED_BRANCH=' + namedBranch + ' s3deploybranch'
      echo stdout
      def lines = stdout.readLines()
      s3VersionPath = lines.get(lines.size()-3)
      e2eTargetUrl = lines.get(lines.size()-1)
    }
    
    stage('Test e2e') {
      sh 'make E2E_TARGETURL=' + e2eTargetUrl + ' teste2e'

      if (!namedBranch) {
        // Remove the branch created if tests succceed
        sh 'echo "yes" | make S3_VERSION_PATH=' + s3VersionPath + ' s3activateint'
      }
    }

  } catch(e) {
    throw e;

  } finally {
    sh 'make DEPLOY_GIT_BRANCH=' + deployGitBranch  + ' cleanall'
  }
}
