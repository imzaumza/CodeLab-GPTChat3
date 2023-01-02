import express from 'express';

//get data from the .env file
import * as dotenv from 'dotenv';

//make cross-request
import cors from 'cors';

//simplified way of using the openapi.
import { Configuration, OpenAIApi } from 'openai';

//to use the dotenv variables
dotenv.config();

//The configurations
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//create an instance of openai
const openai = new OpenAIApi(configuration);

//initialize our express application
const app = express();

//setup middleware and cross-request, allows the server to be called from the front-end
app.use(cors());

//pass json from the front end to the backend
app.use(express.json());

//create a dummy root route
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeLab',
    })
});

//receives/sends data to/from front end
app.post('/', async (req, res) => {
    try{
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
    })

    app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));