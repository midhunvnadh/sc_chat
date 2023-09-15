from syns import get_synonyms
from pre_proc import preprocess_text
import pandas as pd

#open csv
df = pd.read_csv('dataset/mr/Medicine_Description.csv')
map = []
for index, row in df.iterrows():
    desc = row["Description"]
    words = preprocess_text(desc)
    tags = []
    for word in words:
        syns = get_synonyms(word)
        for syn in syns:
            syn = syn.lower()
            if syn not in tags:
                tags.append(syn)
        word = word.lower()
        if word not in tags:
            tags.append(word)
    #sort
    tags.sort()
    summary = {
        "name": row["Drug_Name"],
        "description": desc,
        "uses": row["Reason"],
        "tags": tags,
    }
    map.append(summary)
    print("Processed " + str(index) + " of " + str(len(df)) + " rows.", end="\r")

import json
with open('medicine_data.json', 'w') as outfile:
    json.dump(map, outfile)