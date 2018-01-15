#!/usr/bin/env groovy
pipeline {
    agent any
    stages {
       stage('Build') {
            steps {
                echo 'Building..'
                sh 'make lint debug release'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
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
                echo 'Deploying branch on int....'
                sh 'make s3deploybranch'
            }
        }
        /*
        stage('Test e2e') {
            environment {
                E2E_TARGETURL =  'https://mf-geoadmin3.int.bgdi.ch'
            }
            steps {

                echo 'Testing e2e ...' + env.GIT_BRANCH
                sh 'env'
                sh 'make teste2e'
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
