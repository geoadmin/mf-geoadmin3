#!/usr/bin/env groovy
//lal
// GitHub Pull Request Builder
def ghprb = [
  $class: "GhprbTrigger",
  cron: 'H/5 * * * *',
  triggerPhrase: 'jenkins test',
  useGitHubHooks: true,
  orgsList: 'geoadmin'
]

properties([
  buildDiscarder(logRotator(daysToKeepStr: '10', numToKeepStr: '10')),
  pipelineTriggers([
    cron('H 3 * * *'),
    githubPush(),
    ghprb
  ])
])

node {

    sh 'printenv'

    env.BRANCH = env.ghprbSourceBranch || 'master'
    def scmBranch = 'master'
    if (env.ghprbSourceBranch) {
      scmBranch = '${sha1}'
    }
    checkout([
      $class: 'GitSCM',
      branches: [[name: scmBranch]],
      browser: [$class: 'GithubWeb', repoUrl: 'https://github.com/geoadmin/mf-geoadmin3'],
      doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'iwibot-github', url: 'https://github.com/geoadmin/mf-geoadmin3']]])

    sh 'printenv'
    
    /*stage('Build') {
      sh 'make lint debug release'
    }
    
    stage('Test') {
      sh 'make testdebug testrelease'
    }
    
    if (env.BRANCH == 'master') {
        
      stage('Deploy') {
        sh 'make DEPLOY_GIT_BRANCH=' + env.BRANCH + ' NAMED_BRANCH=false s3copybranch'
      }
    }*/
}
