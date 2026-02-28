import re
import json

def parse_textbook(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    vocab_list = []
    grammar_sentences = []

    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line or '<' in line or '>' in line: continue
        
        # Only parse common lines where it's 2 column vocabulary
        if re.match(r'^[a-z]{3,20}\s+', line) and len(line) < 60:
            # Check if there is a big space or tab separator
            parts = re.split(r'\s{2,}|\t', line)
            if len(parts) >= 2:
                shona = parts[0].split()[0] # take first word
                eng = parts[-1].strip()
                if shona.isalpha() and 2 < len(shona) < 20 and len(eng.split()) <= 4:
                    vocab_list.append({"shona": shona, "english": eng.replace("to ", "")})
            elif " " in line:
                 words = line.split()
                 if len(words) == 2 and words[0].isalpha() and words[1].isalpha():
                     vocab_list.append({"shona": words[0], "english": words[1]})
                 elif len(words) >= 3 and words[0].startswith('ku'):
                     vocab_list.append({"shona": words[0], "english": " ".join(words[1:]).replace("to ", "")})

        # Grammar rules
        if len(line) > 20 and len(line) < 150 and (' Shona ' in line or ' suffix ' in line or ' prefix ' in line or ' verb ' in line) and line[0].isupper() and line.endswith('.'):
             grammar_sentences.append(line)

    unique_vocab = []
    seen = set()
    for v in vocab_list:
        sh = v['shona'].lower()
        eng = v['english'].lower()
        if sh not in seen and not sh.isdigit() and sh != eng and len(eng) > 2 and ' ' not in sh:
            seen.add(sh)
            unique_vocab.append(v)
            
    # Topics
    actions = [v for v in unique_vocab if v['shona'].startswith('ku')]
    nouns = [v for v in unique_vocab if not v['shona'].startswith('ku')]

    ai_context = "Shona Grammar and Vocabulary Notes:\n\nKey Rules:\n"
    for s in grammar_sentences[:50]:
        ai_context += f"- {s}\n"
    
    ai_context += "\nCommon Vocabulary:\n"
    for v in unique_vocab[:100]:
        ai_context += f"{v['shona']} = {v['english']}\n"
        
    with open('shona_ai_context.txt', 'w', encoding='utf-8') as f:
        f.write(ai_context)

    units = []
    def create_unit(title, vocab_chunk):
        exercises = []
        for v in vocab_chunk:
            exercises.append({
                "type": "translate",
                "question": f"How do you say '{v['english']}'?",
                "target": v['shona'],
                "options": [v['shona'], "Mhoro", "Ehe", "Kwete"]
            })
            exercises.append({
                "type": "speak",
                "question": "Speak this phrase:",
                "target": v['shona']
            })
        return {"title": title, "exercises": exercises[:8]}

    if len(actions) >= 10:
        units.append(create_unit("Action Words 1", actions[:10]))
        units.append(create_unit("Action Words 2", actions[10:20]))
    if len(nouns) >= 10:
        units.append(create_unit("Nouns and Objects 1", nouns[:10]))
        units.append(create_unit("Nouns and Objects 2", nouns[10:20]))

    with open('shona_new_units.json', 'w', encoding='utf-8') as f:
        json.dump(units, f, indent=4)
        
    print(f"Extracted {len(unique_vocab)} unique vocabulary words.")
    print(f"Extracted {len(grammar_sentences)} grammar rules.")
    print(f"Generated {len(units)} new lesson units.")

if __name__ == '__main__':
    parse_textbook('shona_lessons.txt')
