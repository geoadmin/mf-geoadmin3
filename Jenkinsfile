#!/usr/bin/env groovy
pipeline {
    agent any
    environment { 
        CC = 'clang'
    }
    stages {
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
        stage('Build') {
            steps {
                echo 'Building..'
                sh '''
                  make lint debug release
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh 'make testdebug testrelease'
         
            }
        }
        /*
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh 'make s3deploybranch' 
            }
        }*/
    }
}
