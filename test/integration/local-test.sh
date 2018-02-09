aws --endpoint-url http://localhost:4569 dynamodb create-table \
  --table-name DivisionsTable \
  --attribute-definitions "AttributeName=id,AttributeType=S" "AttributeName=year,AttributeType=S" \
  --key-schema "AttributeName=year,KeyType=HASH" "AttributeName=id,KeyType=RANGE" \
  --provisioned-throughput "ReadCapacityUnits=5,WriteCapacityUnits=20"

aws --endpoint-url http://localhost:4569 dynamodb create-table \
  --table-name ResultsTable \
  --attribute-definitions "AttributeName=id,AttributeType=S" "AttributeName=year,AttributeType=S" "AttributeName=div,AttributeType=S" \
  --key-schema "AttributeName=year,KeyType=HASH" "AttributeName=id,KeyType=RANGE" \
  --local-secondary-indexes "IndexName=by_div,KeySchema=[{AttributeName=year,KeyType=HASH},{AttributeName=div,KeyType=RANGE}],Projection={ProjectionType=INCLUDE,NonKeyAttributes=[name,schedule,ratings]}" \
  --provisioned-throughput "ReadCapacityUnits=5,WriteCapacityUnits=20"
