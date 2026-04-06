pipeline{
    agent any;
    stages{
        stage("Clean Workspace"){
            steps{ 
                sh "docker system prune -af"
                deleteDir()
            }
        }
        stage("Code Fetch from Github"){
            steps{
                git url:"https://github.com/NareshAdhe/Local_Linker", branch:"main"
                echo "Code cloned Successfully."
            }
        }
        stage("Add .env files"){
            steps{
                withCredentials([
                    file(credentialsId: "LOCAL_LINKER_BACKEND_ENV", variable: "BACKEND_ENV"),
                    file(credentialsId: "LOCAL_LINKER_FRONTEND_ENV", variable: "FRONTEND_ENV")]){
                        sh '''
                        cp $BACKEND_ENV server/.env
                        cp $FRONTEND_ENV client/.env
                        '''
                }
                echo "Copied .env files Successfully."
            }
        }
        stage("Build using docker and Push to DockerHub"){
            steps{
                withCredentials([
                    usernamePassword(credentialsId: "DockerHubCreds", usernameVariable: "DockerHubUser", passwordVariable: "DockerHubPass")]){
                    sh '''
                    echo "$DockerHubPass" | docker login -u "$DockerHubUser" --password-stdin
                    SHORT_COMMIT=$(echo $GIT_COMMIT | cut -c1-7)
                    docker build -t $DockerHubUser/local-linker-frontend:latest -t $DockerHubUser/local-linker-frontend:commit-$SHORT_COMMIT -t $DockerHubUser/local-linker-frontend:build-$BUILD_NUMBER ./client
                    docker build -t $DockerHubUser/local-linker-backend:latest -t $DockerHubUser/local-linker-backend:commit-$SHORT_COMMIT -t $DockerHubUser/local-linker-backend:build-$BUILD_NUMBER ./server
                    docker push --all-tags $DockerHubUser/local-linker-frontend
                    docker push --all-tags $DockerHubUser/local-linker-backend
                    docker image prune -f
                    '''
                    echo "Built and pushed the images to dockerhub Successfully."
                }
            }
        }
        stage("Test"){
            steps{
                echo "Developer will provide with the tests to include."
            }
        }
        stage("Deploy on EC2"){
            steps{
                sh '''
                docker compose pull
                docker compose up -d
                '''
                echo "Deployment Completed Successfully."
            }
        }
    }
}