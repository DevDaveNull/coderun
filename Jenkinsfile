pipeline {
    agent any
    environment {
        DB_URL = 'mysql+pymysql://usr:pwd@host:<port>/db'
        DISABLE_AUTH = true
        google-access-key-id = credentials('google-access-key-id')
        
    }
    stages {
        stage("Сборка") {
            steps {
                script {
                    node {
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
            }
        }
        stage("Тестирование") {
            steps {
                script {
                    node {
                        echo "Тестирование приложения..."
                    }
                }
            }
        }
        stage("Деплой на стейджинг") {
            steps {
                script {
                    node {
                        sh 'chmod u+x deploy smoke-tests'
                        sh './deploy staging'
                        sh './smoke-tests'
                    }
                }
            }
        }
        stage("Проверка работоспособности") {
            steps {
                script {
                    node {
                        input "Следует ли отправить на продакшн?"
                    }
                }
            }
        }
        stage("Деплой на продакшн") {
            steps {
                script {
                    node {
                        sh './deploy prod'
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                node {
                    echo "Это всегда будет выполняться независимо от статуса завершения"
                }
            }
        }
        cleanup {
            script {
                node {
                    echo "Очистка рабочей области"
                    sh 'ls -l'  // Проверка прав доступа
                    retry(3) {  // Повторить 3 раза в случае неудачи
                        cleanWs()
                    }
                }
            }
        }
        success {
            script {
                node {
                    echo "Это будет выполняться, если сборка прошла успешно"
                }
            }
        }
        failure {
            script {
                node {
                    echo "Это будет выполняться, если задача провалилась"
                    mail to: "pecherni@gmail.com",
                         subject: "${env.JOB_NAME} - Сборка № ${env.BUILD_NUMBER} провалилась",
                         body: "Для получения дополнительной информации о провале пайплайна, проверьте консольный вывод по адресу ${env.BUILD_URL}"
                }
            }
        }
        unstable {
            script {
                node {
                    echo "Это будет выполняться, если статус завершения был 'нестабильный', обычно из-за провала тестов"
                }
            }
        }
        changed {
            script {
                node {
                    echo "Это будет выполняться, если состояние пайплайна изменилось"
                    echo "Например, если предыдущий запуск провалился, а сейчас успешный"
                }
            }
        }
        fixed {
            script {
                node {
                    echo "Это будет выполняться, если предыдущий запуск был провальным или нестабильным, а сейчас успешный"
                }
            }
        }
    }
}
