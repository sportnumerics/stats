# pylint: disable=E0401
import boto3
import os
import datetime


def handler(event, context):
    year = event.get('year', str(datetime.datetime.now().year))
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
                            'value': year
                        }
                    ]
                }
            ]
        }
    )
    return str(response)
