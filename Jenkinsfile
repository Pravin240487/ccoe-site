pipeline {
  agent { label 'docker-kitchensink-slave' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
    timeout(time: 1, unit: 'DAYS')
  }
  environment {
    NPM_EMAIL = ''
    NPM_AUTH_KEY = ''
    NODEJS_VERSION = '12'
    CREDENTIALS_ID = 'AWS_EAC_TEST'
    ORG = 'oaccoe'
    REPO = 'CCOE-Site'
  }
  stages {
    stage('Build & Redeploy') {
      when { branch 'master' }
      steps {
        withCredentials([usernamePassword(credentialsId: CREDENTIALS_ID, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh """#!/bin/bash -x
            . /etc/profile.d/jenkins.sh
            yarn config set registry https://repo1.uhc.com/artifactory/api/npm/npm-virtual/
            yarn
            git config --global user.name "${USER}"
            git config --global user.email "${USER}@optum.com"
            git remote set-url origin https://${USER}:${PASS}@github.optum.com/${ORG}/${REPO}.git
            export GIT_USER=${USER}:${PASS}
            export GITHUB_HOST=github.optum.com
            yarn add docusaurus && yarn deploy
          """
        }
      }
    }
  }
}

