import json
import requests
from tenacity import retry,wait_random_exponential,stop_after_attempt
from termcolor import colored
import csv
import sys


GPT_MODEL = "gpt-4-0613"

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
    





if __name__ == "__main__":

    f = sys.argv[1]

    data = json.loads(f)
    
 

    messageInfo = data["messageInfo"]
    companyInfo = data["companyInfo"]
    userInfo = data["userInfo"]

    messages = [{"role":"system","content":"The user name is "+userInfo["userName"]+". His/Her role in the company is "+userInfo["role"]+". So your answer must be accirding to these."}]

    for i in messageInfo["message"]:
        messages.append(i)



   
    respond = chat_completion_request(messages)
    assistantMessage = respond.json()["choices"][0]["message"]


    if(assistantMessage.get("function_call")):
        value = eval(assistantMessage["function_call"]["arguments"])["advise"]
        data = {"role":"assistant","content":value}
        messages.append({"role":"assistant","content":"value"})
        print(json.dumps(data))

    else:
        messages.append(assistantMessage)
        print(json.dumps(assistantMessage))
   