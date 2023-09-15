import requests
from tqdm import tqdm
 
def download_file(url, save_path): 
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024  # 1 KB
    print(f"Downloading to {save_path}")
    with open(save_path, 'wb') as file:
        for data in tqdm(response.iter_content(block_size), 
                         total=total_size // block_size, 
                         unit='KB', 
                         unit_scale=True):
            file.write(data)
    print("\nDownload completed.") 

def download_model():
    url = "https://api.github.com/repos/midhunvnadh/sc_chat/releases/latest"
    json = requests.get(url).json()
    assets = json["assets"]
    for asset in assets:
        url = asset["browser_download_url"]
        filename = asset["name"]
        download_file(url, "skin_disease_classifier.h5")
        break

if __name__ == "__main__":
    download_model()