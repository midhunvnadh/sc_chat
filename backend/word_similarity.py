def levenshtein_similarity(str1, str2):
    len_str1 = len(str1)
    len_str2 = len(str2)

    dp = [[0] * (len_str2 + 1) for _ in range(len_str1 + 1)]

    for i in range(len_str1 + 1):
        for j in range(len_str2 + 1):
            if i == 0:
                dp[i][j] = j
            elif j == 0:
                dp[i][j] = i
            elif str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i]
                                   [j - 1], dp[i - 1][j - 1])

    max_len = max(len_str1, len_str2)
    similarity = 1.0 - (dp[len_str1][len_str2] / max_len)
    return similarity
