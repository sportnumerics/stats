# pylint: disable=E0401
import boto3
import os


def handler(event, context):
    client = boto3.client('ecs')
    response = client.run_task(
        cluster=os.environ['ECS_CLUSTER'],
        launchType='FARGATE',
        taskDefinition=os.environ['ECS_TASK'],
        count=1,
        platformVersion='LATEST',
        networkConfiguration={
            'awsvpcConfiguration': {
                'subnets': [
                    'subnet-53f5bb0a',
                    'subnet-24bfda41'
                ],
                'assignPublicIp': 'ENABLED'
            }
        },
        overrides={
            'containerOverrides': [
                {
                    'name': 'stats',
                    'environment': [
                        {
                            'name': 'YEAR',
                            'value': event['year']
                        }
                    ]
                }
            ]
        }
    )
    return str(response)
