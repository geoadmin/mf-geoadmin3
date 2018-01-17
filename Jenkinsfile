#!/usr/bin/env groovy

node(label: 'jenkins-slave') {
    
  try {
    checkout scm

    stage('Build') {
      sh 'make lint debug release'
    }

    stage('Test') {
      sh 'make testdebug testrelease'
    }

    // If it's a PR
    if (env.ghprbSourceBranch) {

      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.ghprbSourceBranch + ' s3deploybranch'
      }

      stage('Test e2e') {
        sh 'make E2E_TARGETURL=https://mf-geoadmin3.int.bgdi.ch/' + env.ghprbSourceBranch + '/index.html teste2e'
      }

    // if it's the master
    } else {
      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=master NAMED_BRANCH=false s3deploybranch'
      }
    }
  } catch(e) {
    throw e;

  } finally {
    sh 'make cleanall'
  }
} 
