from pre_proc import preprocess_text
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer


def get_medicine_data():
    import json
    with open('medicine_data.json') as json_file:
        data = json.load(json_file)
        return data
    
def summarize_text(text, num_sentences=2):
    # Initialize the parser with the input text
    parser = PlaintextParser.from_string(text, Tokenizer("english"))

    # Initialize the LexRank summarizer
    summarizer = LexRankSummarizer()

    # Get a summary with a specified number of sentences
    summary = summarizer(parser.document, num_sentences)

    # Combine the sentences in the summary
    summarized_text = " ".join([str(sentence) for sentence in summary])

    return summarized_text

def find_medicine(query):
    query = summarize_text(query)
    print("Query: " + query)
    keywords = preprocess_text(query)
    data = get_medicine_data()
    matches = []
    for medicine in data:
        rank = 0
        for keyword in keywords:
            if keyword in medicine["tags"]:
                rank += 1
            med_name = medicine["name"]
            if keyword in med_name:
                rank += 1
        if rank > 0:
            matches.append((rank, medicine))
    matches.sort(key=lambda tup: tup[0], reverse=True)
    return matches[:5]

input = input("Enter a query: ")
matches = find_medicine(input)
print("Found " + str(len(matches)) + " matches.")
for match in matches:
    print(match[1]["name"] + ": " + match[1]["description"])
    print("Uses: " + match[1]["uses"])
    print("Tags: " + str(match[1]["tags"]))
    print("Rank: " + str(match[0]))
    print()