import { usePostHog } from "posthog-js/react";
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./Home/Home";
import { Toaster } from "./ui/toaster";

const models = [
  {
    name: "gpt-4",
    token_input_cost: 0.00003,
    token_output_cost: 0.00006,
  },
  {
    name: "gpt-3.5-turbo-0125",
    token_input_cost: 0.0000005,
    token_output_cost: 0.0000015,
  },
];

const userId = "exampleUser";

// const Home = () => {
//   const [userInput, setUserInput] = useState('');
//   const [chatGPTResponse, setChatGPTResponse] = useState('');
//   const [selectedModel, setSelectedModel] = useState(models[0]);
//   const posthog = usePostHog();

//   posthog.identify(userId)

//   const fetchChatGPTResponse = async () => {
//     try {
//       const openai = new OpenAI({
//         apiKey: 'sk-proj-O5Iz8wG6Ji7BubgBqaQhT3BlbkFJhhmJaMVD7QQ7WxfwcLrI',
//         dangerouslyAllowBrowser: true
//       });

//       setChatGPTResponse('Generating...');
//       const chatCompletion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: userInput }],
//         model: selectedModel.name,
//       });
//       const inputCostInDollars = chatCompletion.usage.prompt_tokens * selectedModel.token_input_cost;
//       const outputCostInDollars = chatCompletion.usage.completion_tokens * selectedModel.token_output_cost;
//       const response = chatCompletion.choices[0].message.content;
//       posthog.capture('chat_completion', {
//         model: chatCompletion.model,
//         prompt: userInput,
//         response: response,
//         prompt_tokens: chatCompletion.usage.prompt_tokens,
//         completion_tokens: chatCompletion.usage.completion_tokens,
//         total_tokens: chatCompletion.usage.total_tokens,
//         input_cost_in_dollars: inputCostInDollars,
//         output_cost_in_dollars: outputCostInDollars,
//         total_cost_in_dollars: inputCostInDollars + outputCostInDollars
//       });

//       await axios.post("http://127.0.0.1:5151", {
//         modelInput: userInput,
//         modelOutput: response,
//       }, { headers: { 'Content-Type': 'application/json' }}).catch((e) => {
//         console.error(`err`, e)
//       })
//       setChatGPTResponse(response);
//     } catch (error) {
//       setChatGPTResponse(error.message);
//     }
//   };

//   const fetchCustomGPTResponse = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch(`https://co6neqqjtujiqc3l4ixq3sqr4u0bzjoc.lambda-url.eu-north-1.on.aws/?user_query=${userInput}`);
//       const data = await response.json();
//       const llm_response = data['response'];
//       console.log(userInput);
//       console.log(llm_response);
//       setChatGPTResponse(llm_response || 'No response data');
//       posthog.capture('custom_gpt_completion', {
//         prompt: userInput,
//         response: llm_response
//       });
//     } catch (error) {
//       setChatGPTResponse(`Error: ${error.message}`);
//     }
//   };

//   const handleInputChange = (event) => {
//     setUserInput(event.target.value);
//   };

//   const handleModelChange = (event) => {
//     setSelectedModel(models.filter(m => (m.name === event.target.value))[0]);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     fetchChatGPTResponse();
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px' }}>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={userInput}
//           onChange={handleInputChange}
//           placeholder="Type your message"
//         />
//         <button type="submit">Send GPT</button>
//         <button type="button" onClick={fetchCustomGPTResponse}>Send Custom GPT</button>
//       </form>
//       <select value={selectedModel.name} onChange={handleModelChange}>
//         {models.map((model, index) => (
//           <option key={index} value={model.name}>
//             {model.name}
//           </option>
//         ))}
//       </select>
//       <Link to="/settings">
//         <button type="button">Settings</button>
//       </Link>
//       <label>ChatGPT Response:</label>
//       <label>{chatGPTResponse}</label>
//     </div>
//   );
// };

const Settings = () => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  posthog.capture("loaded_settings");

  const handleBackClick = () => {
    posthog.capture("navigated_home");
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "20px",
      }}
    >
      <h1>Settings</h1>
      <button onClick={() => handleBackClick()}>Back</button>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
};

export default App;
