pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('install') {
            when {
                branch 'main'
            }
            environment {
                VITE_API_URL = credentials("APEX_WEB_QA_VITE_API_URL")
            }
            steps {
                echo "Creating Environment variables: ${env.BRANCH_NAME}"
                sh '''#!/bin/bash
                echo 'Creating .env file...'
                # Remove existing .env file if it exists
                rm -f .env
                    echo VITE_API_URL=$VITE_API_URL > .env
                    npm i --force
                '''
            }
        }

        stage('dev-main') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying the software'
                sh 'npm run build'
            }
        }
    }
}
