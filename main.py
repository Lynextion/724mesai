import json
import requests
from tenacity import retry,wait_random_exponential,stop_after_attempt
from termcolor import colored
import csv


GPT_MODEL = "gpt-3.5-turbo-0613"

@retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
def chat_completion_request(messages,functions=None,function_call=None,model=GPT_MODEL):
    headers = {
        "Content-Type" :"application/json",
        "Authorization": "Bearer " + "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",
    }
    json_data = {"model":model,"messages":messages}
    
    if functions is not None:
        json_data.update({"functions":functions})
    
    if function_call is not None:
        json_data.update({"funtion_call":function_call})

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=json_data,
        )

        return response
    
    except Exception as e:
        print("Unable to generate ChatCompletion request")
        print(f"Exception: {e}")
        return e


def createFunction(topic):

    functions = [
        {
            "name":"Advisor",
            "description":"Your Job is answer our questions",
            "parameters":{
                "type":"object",
                "properties":{
                    "advise":{
                        "type":"string",
                        "description":f"""
                                    We are a company.
                                    We gonna Ask you some technical problems and you will help us.
                                    If you are not sure about something, do not assume ask us
                                    This is you topic={topic} if this value is not 'None' consider this in you answers
                                    You SHOULD CALL THIS FUNCTION EVERYTIME
                                """
                    }
                },
                "required":["advise"],
            }
        }
    ]

    return functions



def __main__(message):

    with open ("./messages.json","r") as outfile:
        data = json.load(outfile)
  
    
    topic = data["topic"]

    function = createFunction(topic)
    
    messages = []
    messages.append({"role":"system","content":"You are an adviser. Give you answers as you are advisor"})

    if data["messages"]:
        messages.append(data["messages"])

    messages.append({"role":"user","content":message})

    chat_response = chat_completion_request(messages,function)
    

    assistant_message = chat_response.json()["choices"][0]["message"]
    
    newData = {
        "user":data["user"],
        "topic":data["topic"],
        "messages":messages
    }


    data.update(newData)

    with open("./messages.json","w") as outfile :
        json.dumps(data)

    return data    