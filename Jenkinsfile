#!/usr/bin/env groovy

node {
  checkout scm

  try {

    stage('Build') {
      sh 'make lint debug release'
    }

    stage('Test') {
      sh 'make testdebug testrelease'
    }

    if (env.ghprbSourceBranch) {

      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.ghprbSourceBranch + ' s3copybranch'
      }

      stage('Test e2e') {
        sh 'make E2E_TARGETURL=https://mf-geoadmin3.int.bgdi.ch/' + env.ghprbSourceBranch + '/index.html teste2e'
      }
    }
  } catch(e) {
    throw e;

  } finally {
    sh 'make cleanall'
  }
}
