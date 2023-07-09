import json
import requests
from tenacity import retry,wait_random_exponential,stop_after_attempt
from termcolor import colored
import csv
import sys


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
    


def createFunction(companyInfo):

    functions = [
        {
            "name":"Advisor",
            "description":f"""You are a company helper at {companyInfo["companyName"]}.The sector of this company is {companyInfo["sector"]} Workers gonna ask questions about their job""",
            "parameters":{
                "type":"object",
                "properties":{
                    "advise":{
                        "type":"string",
                        "description":f"""
                                    We are a company at {companyInfo["companyName"]}.
                                    The sector of this company {companyInfo["sector"]}.
                                    The questions generally about this sector {companyInfo["sector"]} so anwer the questions acording to this.
                                    You are an adviser and helper for this company
                                    Advise people who ask you something 
                                    call this function everytime
                                """
                    }
                },
                "required":["advise"],
            }
        }
    ]

    return functions





f = open("./messages.json")
    
data = json.loads(f.read())
f.close()

messageInfo = data["messageInfo"]
companyInfo = data["companyInfo"]
userInfo = data["userInfo"]

messages = [{"role":"system","content":"The user name is "+userInfo["userName"]+". His/Her role in the company is "+userInfo["role"]+". So your answer must be accirding to these."}]

for i in messageInfo["message"]:
    messages.append(i)



function = createFunction(companyInfo)
respond = chat_completion_request(messages,function)
assistantMessage = respond.json()["choices"][0]["message"]



messages.append(assistantMessage)
print(json.dumps(assistantMessage))
with open ("./messages.json","w") as outfile:
    data["message"] = messages
    object = json.dumps(data)
    outfile.write(object)


