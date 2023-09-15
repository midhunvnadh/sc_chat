import nltk
from nltk.corpus import wordnet

nltk.download('punkt')
nltk.download('wordnet')

def get_synonyms(word):
    synonyms = []
    
    synsets = wordnet.synsets(word)
    
    for synset in synsets:
        for lemma in synset.lemmas():
            synonyms.append(lemma.name())
    
    return list(set(synonyms))