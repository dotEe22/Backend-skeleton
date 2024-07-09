const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4001;


const mockUsers = [
    { id: 1, username: " anson", displayName: "Anson" },
    { id: 2, username: " kai", displayName: "Kai" },
    { id: 3, username: " jack", displayName: "Jack" },
    { id: 4, username: " amanda", displayName: "Amanda" },
    { id: 5, username: " georgia", displayName: "Georgia" },
    { id: 6, username: " henry", displayName: "Henry" },
    { id: 7, username: "eli", displayName: "Eli" },

];

//GET METHOD

app.get("/", (request, response) => {
    response.status(201).send({ msg: 'hello' });
})
app.get("/api/users", (request, response) => {
    console.log(request.query);

    const { query: { filter, value }, } = request;
    // when filter and value are undefined
    // if(!filter && !value ) return response.send(mockUsers)

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )

    return response.send(mockUsers);

});

app.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

app.get('/api/users/:id', (request, response) => {
    console.log(request.params)
    const parsedId = parseInt(request.params.id);
    //validation
    if (isNaN(parsedId)) return response.status(400).send({ msg: "Bad Request, Invalid ID" })

    const findUser = mockUsers.find((user) => user.id === parsedId)
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
})


app.post("/api/users", (request, response) => {
    console.log(request.body)

    const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})


app.listen(PORT, () => {
    console.log(`Server established at ${PORT}`);
})
