import json, datetime
import requests

from home.constants import homePath

def get_access_token():
    with open(f'{homePath}/data/tokens.json', 'r') as f:
        token_dict = json.load(f)

    expiry_time = datetime.datetime.fromisoformat(token_dict['expiry'])
    if expiry_time > datetime.datetime.now():
        return token_dict['access_token']
    
    with open(f'{homePath}/data/oauth_secret_web.json', 'r') as f:
        credentials = json.load(f)['web']
        
    url = "https://www.googleapis.com/oauth2/v4/token?"+\
            f"client_id={credentials['client_id']}"+\
            f"&client_secret={credentials['client_secret']}"+\
            f"&refresh_token={token_dict['refresh_token']}"+\
            "&grant_type=refresh_token"

    resp = requests.post(url).json()
    access_token = resp['access_token']
    # refresh_token = resp['refresh_token']

    token_dict['access_token'] = access_token
    # token_dict['refresh_token'] = refresh_token
    new_expiry = datetime.datetime.now() + datetime.timedelta(seconds=3599)
    token_dict['expiry'] = new_expiry.isoformat()

    with open(f'{homePath}/data/tokens.json', 'w') as f:
        json.dump(token_dict, f)
    
    return access_token

if __name__ == "__main__":
    print(get_access_token())