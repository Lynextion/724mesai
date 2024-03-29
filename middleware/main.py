import json
import requests
from tenacity import retry,wait_random_exponential,stop_after_attempt
from termcolor import colored
import csv
import sys
import requests



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
    
functions_list = ['name','task_description','showTask']

functions = [
 {
        "name": "create_task",
        "description": "Create a task",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Name of the task according to input",
                },
                "task_description": {
                    "type": "string",
                    "description": "Description of the task.",
                },
                "task_date": {
                    "type": "string",
                    "description": "if date given your output must be a formal date format as dd.mm.yy.If date is not given output must be 'no date''",
                },
                
            },
            "required": ["name", "task_description"],
        },
    },
    {
        "name": "show_task",
        "description": "showing current tasks",
        "parameters": {
            "type": "object",
            "properties": {
                "showTask": {
                    "type": "string",
                    "description": "when this function called the output must be 'show_tasks'",
                },
               
            },
            "required": ["showTask",],
        },
    },
    
        
]

def current_date():
    city = 'istanbul'
    api_url = 'https://api.api-ninjas.com/v1/worldtime?city={}'.format(city)
    response = requests.get(api_url, headers={'X-Api-Key': 'h4E8qC56XIu4y3NmnblKQA==tHKXzyVGsZa9D3GX'})
    if response.status_code == requests.codes.ok:
        return response.text
    else:
        return "no date"



if __name__ == "__main__":

    f = sys.argv[1]

    data = json.loads(f)
    
 

    messageInfo = data["messageInfo"]
    companyInfo = data["companyInfo"]
    userInfo = data["userInfo"]

    messages = [{"role":"system","content":"The user name is "+userInfo["userName"]+". His/Her role in the company is "+userInfo["role"]+". So your answer must be accirding to these.The name of the company user working currently is"+companyInfo["companyName"]+".The sector of the company is"+companyInfo["sector"]+".Lastly little info about the company"+companyInfo["companyInfo"]+". Your answers must bu in language according to last input.Current date is" + current_date() +"."}]

    for i in messageInfo["message"]:
        messages.append(i)



   
    respond = chat_completion_request(messages,functions=functions)
    assistantMessage = respond.json()["choices"][0]["message"]


    if(assistantMessage.get("function_call")):
        if(assistantMessage["function_call"]["name"] == "create_task"):
            task_name = eval(assistantMessage["function_call"]["arguments"])["name"]
            task_description = eval(assistantMessage["function_call"]["arguments"])["task_description"]
            task_date = eval(assistantMessage["function_call"]["arguments"])["task_date"]
            data = {"task_name":task_name,"task_description":task_description,"task_date":task_date}
            messages.append({"role":"assistant","content":task_name})

            with open("./testi.txt",'a') as file:
                file.write(str(data))
            print(json.dumps({"role":"assistant","content":"The task created as "+task_name,"taskCreated":"yes","task":data}))

        if(assistantMessage["function_call"]["name"] == "show_task"):
             task_name = eval(assistantMessage["function_call"]["arguments"])["showTask"]
             with open("./testi.txt",'a') as file:
                file.write(str(assistantMessage["function_call"]))
            
             print(json.dumps({"role":"assistant","content":"The task will be showed ","taskCreated":"no","taskCalled":"yes"}))

    else:
        messages.append(assistantMessage)
        data = {
            "role":assistantMessage["role"],
            "content":assistantMessage["content"],
            "taskCreated":"no",
            "taskCalled":"no"

        }

        print(json.dumps(data))
   