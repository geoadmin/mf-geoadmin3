#!/usr/bin/env groovy

node {
  checkout scm

  try {
    // Define the branch targeted
    env.BRANCH = env.ghprbSourceBranch || 'master'

    stage('Build') {
      sh 'make lint debug release'
    }

    stage('Test') {
      sh 'make testdebug testrelease'
    }

    // if it's pull request
    if (env.BRANCH != 'master') {

      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.BRANCH + ' s3copybranch'
      }

      stage('Test e2e') {
        sh 'make E2E_TARGETURL=https://mf-geoadmin3.int.bgdi.ch/' + env.BRANCH + '/index.html teste2e'
      }

    // if it's master
    } else {
      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.BRANCH + ' NAMED_BRANCH=false s3copybranch'
      }
    }
  } catch(e) {
    throw e;

  } finally {
    sh 'make cleanall'
  }
}
