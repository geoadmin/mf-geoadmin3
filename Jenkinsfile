#!/usr/bin/env groovy
pipeline {
    agent any
    stages {
       stage('Test') {
          steps {
            sh 'printenv'
         }
       }
       stage('Build') {
            steps {
                sh 'make lint debug release'
            }
        }
       /* stage('Test') {
            steps {
                sh 'make testdebug testrelease'
            }
        }
        stage('Deploy') {
            when {
                not {
                    branch 'master'
                }
            }
            steps {
                sh 'make DEPLOY_GIT_BRANCH=' + env.ghprbSourceBranch + ' s3copybranch'
            }
        }
        stage('Test e2e') {
            when {
                not {
                    branch 'master'
                }
            }
            steps {
                sh 'make E2E_TARGETURL=https://mf-geoadmin3.int.bgdi.ch/' + env.ghprbSourceBranch + '/index.html teste2e'
            }
        }*/
    }
    post {
        always {
            echo 'Clean'
            sh 'make cleanall'
        }
    }
}
