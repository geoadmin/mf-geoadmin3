#!/usr/bin/env groovy

// Common config between geoamdin_XXX jenkins jobs
properties([
  buildDiscarder(logRotator(daysToKeepStr: '10', numToKeepStr: '10')),
  pipelineTriggers([
    githubPush()
  ])
])

node(label: 'jenkins-slave') {

  env.BRANCH_NAME = env.ghprbSourceBranch || 'master'

  try {

    stage('Build') {
      sh 'make lint debug release'
    }

    stage('Test') {
      sh 'make testdebug testrelease'
    }

    if (env.BRANCH != 'master') {

      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.BRANCH + ' s3copybranch'
      }

      stage('Test e2e') {
        sh 'make E2E_TARGETURL=https://mf-geoadmin3.int.bgdi.ch/' + env.BRANCH + '/index.html teste2e'
      }
    }
  } catch(e) {
    throw e;

  } finally {
    sh 'make cleanall'
  }
} 
