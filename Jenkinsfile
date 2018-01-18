#!/usr/bin/env groovy

node(label: 'jenkins-slave') {
  def e2eTargetUrl
  def stdout

  // If it's master
  def deployGitBranch = 'master'
  def namedBranch = 'false'

  // If it's a PR
  if (env.ghprbSourceBranch) {
    deployGitBranch = env.ghprbSourceBranch
    namedBranch = 'true'
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
      e2eTargetUrl = lines.get(lines.size()-1)
    }
    
    stage('Test e2e') {
      sh 'make E2E_TARGETURL=' + e2eTargetUrl + ' teste2e'
    }

  } catch(e) {
    throw e;

  } finally {
    sh 'make DEPLOY_GIT_BRANCH=' + deployGitBranch  + ' cleanall'
  }
}
