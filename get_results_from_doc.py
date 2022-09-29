def get_results_from_doc(doc):
    result = {}
    if (doc._.language != "fr") :
        return result
    for ent in doc.ents:
        if ent.label_ == "FROM_LOC":
            result["from"] = ent.text
        if ent.label_ == "TO_LOC":
            result["to"] = ent.text
    return result