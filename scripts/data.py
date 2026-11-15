from wordfreq import zipf_frequency
import json
answers = json.load(open('data/answers.json'))
json.dump({w: zipf_frequency(w, 'en') for w in answers}, open('data/freq.json', 'w'))