import { CloudWatchLogsClient, GetLogEventsCommand, DescribeLogStreamsCommand } from '@aws-sdk/client-cloudwatch-logs';

const client = new CloudWatchLogsClient({
    region: 'ap-south-1',
    endpoint: 'http://localhost:4566',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
});

export async function getLogs() {
    try {
        // First, get the log streams
        const streams = await client.send(new DescribeLogStreamsCommand({
            logGroupName: '/microservices/logger',
            orderBy: 'LastEventTime',
            descending: true,
        }));

        // Get logs from the latest stream
        if (streams.logStreams && streams.logStreams.length > 0) {
            const streamName = streams.logStreams[0].logStreamName;

            const logs = await client.send(new GetLogEventsCommand({
                logGroupName: '/microservices/logger',
                logStreamName: streamName,
            }));

            console.log('Logs:', JSON.stringify(logs.events, null, 2));
        }
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}