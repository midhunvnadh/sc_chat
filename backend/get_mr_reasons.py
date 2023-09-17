from get_best_medicines import get_medicine_data
def get_reasons():
    data = get_medicine_data()
    reasons = []
    for medicine in data:
        reasons.append(medicine["uses"])
    reasons = list(set(reasons))
    return reasons