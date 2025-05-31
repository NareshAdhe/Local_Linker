pipeline{
    agent any
    stages {
        stage('Code') {
            steps {
                echo 'Checking out code...'
                git url: 'https://github.com/NareshAdhe/Local_Linker.git', branch: 'main'
                echo 'Cloned the repo!'
            }
        }
        stage('Build and Push') {
            steps {
                echo 'Building...'
                withCredentials([usernamePassword(credentialsId: 'dockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "docker build -t ${USERNAME}/local-linker-frontend:latest ./client"
                    sh "docker push ${USERNAME}/local-linker-frontend:latest"
                    sh "docker build -t ${USERNAME}/local-linker-backend:latest ./server"
                    sh "docker push ${USERNAME}/local-linker-backend:latest"
                }
                echo 'Build Complete!'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'minikube stop'
                sh 'minikube start'
                sh 'minikube addons enable ingress'
                sh 'kubectl apply -f kubernetes/namespace.yaml'
                sh 'kubectl apply -f kubernetes/redis-svc.yaml -f kubernetes/frontend-svc.yaml -f kubernetes/backend-svc.yaml'
                sh 'kubectl apply -f kubernetes/backend-cm.yaml -f kubernetes/backend-secret.yaml -f kubernetes/frontend-cm.yaml'
                sh 'kubectl apply -f kubernetes/redis-dep.yaml'
                sh 'kubectl apply -f kubernetes/backend-dep.yaml'
                sh 'kubectl apply -f kubernetes/frontend-dep.yaml'
                echo 'Deployment Complete!'
            }
        }
    }
}