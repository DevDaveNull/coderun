pipeline {
    agent any
    environment {
        DB_URL = 'mysql+pymysql://usr:pwd@host:<port>/db'
        DISABLE_AUTH = true
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-access-secret-key')
    }
    stages {
        stage("Сборка") {
            steps {
                echo "Сборка приложения..."
                sh '''
                    echo "Этот блок содержит многострочные шаги"
                    ls -lh
                '''
                sh '''
                    echo "URL базы данных: ${DB_URL}"
                    echo "DISABLE_AUTH: ${DISABLE_AUTH}"
                    env
                '''
                echo "Запуск задачи с номером сборки: ${env.BUILD_NUMBER} на ${env.JENKINS_URL}"
            }
        }
        stage("Тестирование") {
            steps {
                echo "Тестирование приложения..."
            }
        }
        stage("Деплой на стейджинг") {
            steps {
                sh 'chmod u+x deploy smoke-tests'
                sh './deploy staging'
                sh './smoke-tests'
            }
        }
        stage("Проверка работоспособности") {
            steps {
                input "Следует ли отправить на продакшн?"
            }
        }
        stage("Деплой на продакшн") {
            steps {
                sh './deploy prod'
            }
        }
    }
    post {
        always {
            echo "Это всегда будет выполняться независимо от статуса завершения"
        }
        cleanup {   
            script {
                node {
            echo "Очистка рабочей области"
            cleanWs()
        }
            }
        }
    }
        success {
            echo "Это будет выполняться, если сборка прошла успешно"
        }
        failure {
            echo "Это будет выполняться, если задача провалилась"
            mail to: "pecherni@gmail.com",
                 subject: "${env.JOB_NAME} - Сборка № ${env.BUILD_NUMBER} провалилась",
                 body: "Для получения дополнительной информации о провале пайплайна, проверьте консольный вывод по адресу ${env.BUILD_URL}"
        }
        unstable {
            echo "Это будет выполняться, если статус завершения был 'нестабильный', обычно из-за провала тестов"
        }
        changed {
            echo "Это будет выполняться, если состояние пайплайна изменилось"
            echo "Например, если предыдущий запуск провалился, а сейчас успешный"
        }
        fixed {
            echo "Это будет выполняться, если предыдущий запуск был провальным или нестабильным, а сейчас успешный"
        }
    }
}