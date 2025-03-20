# Telehealth Copilot

## Overview

Custom LLM with RAG + JSON optimizations

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

## Usage

To start the application, use the following command:

```bash
npm start
```

## Deployment

You need to run the app via a public endpoint, you can use a service like [ngrok](https://ngrok.com/) or deploy it to a cloud provider like [Heroku](https://www.heroku.com/).

5. Copy the public URL and set it in your Telehealth-Copilot ConvoAI URL config.

## RAG

Project includes sampleData, you can enter the patient id from sample data to get more accurate predictions, to add a new patient

E.g.

```
POST {url}/patients
{
  "name": "Jane Doe",
  "dob": "1987-09-15",
  "history": "Jane is a 36-year-old teacher who has struggled with seasonal allergies since childhood. In 2021, she was diagnosed with mild asthma, which worsens during spring and fall due to pollen exposure. She manages her symptoms with an albuterol inhaler as needed and daily antihistamines. In 2019, she underwent surgery for a deviated septum to improve breathing. Recently, she has experienced occasional shortness of breath during exercise, leading her doctor to recommend pulmonary function testing. She follows a Mediterranean diet and practices yoga for stress relief. Her family history includes asthma on her father's side and eczema on her mother's side."
}
```

Response

```
{
    "id": "1741073304238",
    "name": "Jane Doe",
    "dob": "1987-09-15",
    "history": "Jane is a 36-year-old teacher who has struggled with seasonal allergies since childhood. In 2021, she was diagnosed with mild asthma, which worsens during spring and fall due to pollen exposure. She manages her symptoms with an albuterol inhaler as needed and daily antihistamines. In 2019, she underwent surgery for a deviated septum to improve breathing. Recently, she has experienced occasional shortness of breath during exercise, leading her doctor to recommend pulmonary function testing. She follows a Mediterranean diet and practices yoga for stress relief. Her family history includes asthma on her father's side and eczema on her mother's side.",
    "dateAdded": "2025-03-04"
}
```

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or inquiries, please contact us at support@telehealthcopilot.com.
