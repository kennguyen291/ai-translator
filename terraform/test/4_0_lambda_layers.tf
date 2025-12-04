locals {
    external_lambda_layers = {
        boto3 = "arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-boto3:23",
        PyJWT = "arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-PyJWT:1"
    }
}
