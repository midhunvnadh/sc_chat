from pre_proc import preprocess_text
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from is_substring import is_substring as issub
from word_similarity import levenshtein_similarity as lsim


def get_medicine_data():
    import json
    with open('medicine_data.json') as json_file:
        data = json.load(json_file)
        return data


def summarize_text(text, num_sentences=2):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))

    summarizer = LexRankSummarizer()

    summary = summarizer(parser.document, num_sentences)
    summarized_text = " ".join([str(sentence) for sentence in summary])

    return summarized_text


def find_medicine(query, reason):
    query = summarize_text(query)
    print("Query: " + query)
    keywords = preprocess_text(query)
    data = get_medicine_data()
    if (reason != None):
        reason = reason.lower()
        data = [medicine for medicine in data if reason in medicine["uses"].lower()]
    matches = []
    for medicine in data:
        rank = 0
        for keyword in keywords:
            if keyword in medicine["tags"]:
                rank += 1
            med_name = medicine["name"]
            if keyword in med_name:
                rank += 1
            if keyword in medicine["uses"]:
                rank += 1
            for tag in medicine["tags"]:
                if issub(keyword, tag):
                    rank += 1
        if rank > 0:
            matches.append((rank, medicine))
    matches.sort(key=lambda tup: tup[0], reverse=True)
    matches = [match[1] for match in matches]
    matches = [{"name": match["name"], "description": match["description"],
                "uses": match["uses"]} for match in matches]

    print("Searching...")
    if (len(matches) == 0 and reason != None):
        return find_medicine(query, None)

    return matches[:5]
