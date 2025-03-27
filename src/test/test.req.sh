for i in {1..50}; do
    curl --location 'http://localhost:3055/v1/api/test/click/add' \
    --header 'Content-Type: application/json' \
    --data '{
        "productId": 33,
        "userId": 222
    }' &
done
wait