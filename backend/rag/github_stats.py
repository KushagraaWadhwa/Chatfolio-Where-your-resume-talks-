import requests
import re
import time
from functools import lru_cache

# --- Caching Setup ---
@lru_cache(maxsize=10)
def cached_get_github_repos():
    """Cache GitHub repos for 10 minutes."""
    return get_github_repos()

def get_github_repos_with_cache():
    return cached_get_github_repos()

# Optional: Reset cache every 10 minutes (run in a background thread if needed)
def reset_cache():
    while True:
        time.sleep(600)  # Clear cache every 10 minutes
        cached_get_github_repos.cache_clear()

# --- Default Settings ---
DEFAULT_GITHUB_USERNAME = "KushagraaWadhwa"  
HEADERS = {"User-Agent": "Mozilla/5.0"}

# --- API Endpoints ---
GITHUB_BASE_URL = "https://api.github.com/users/"
GITHUB_REPOS_URL = "https://api.github.com/repos/"

# --- User Profile Functions ---
def get_user_stats(username=DEFAULT_GITHUB_USERNAME):
    """Fetch user profile details including followers and repo count."""
    url = f"{GITHUB_BASE_URL}{username}"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            return {
                "name": data.get("name", "N/A"),
                "bio": data.get("bio", "No bio available"),
                "public_repos": data.get("public_repos", 0),
                "followers": data.get("followers", 0),
                "stars": get_total_stars(username)
            }
        else:
            return {"error": "Failed to fetch user details."}
    
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

def get_total_stars(username=DEFAULT_GITHUB_USERNAME):
    """Fetch total stars across all repositories."""
    url = f"{GITHUB_BASE_URL}{username}/repos"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            repos = response.json()
            total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
            return total_stars
        else:
            return 0
    except requests.exceptions.RequestException:
        return 0

def get_contribution_stats(username=DEFAULT_GITHUB_USERNAME):
    """Fetch user's total commits for the last year."""
    url = f"https://api.github.com/search/commits?q=author:{username}&per_page=1"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/vnd.github.cloak-preview"  # Required for commit search
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return {"total_commits": data.get("total_count", 0)}
    return {"error": "Failed to fetch commit count."}

def get_last_push_event(username=DEFAULT_GITHUB_USERNAME):
    """Fetch the most recent push event."""
    url = f"{GITHUB_BASE_URL}{username}/events"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        events = response.json()
        push_events = [event for event in events if event.get("type") == "PushEvent"]
        if push_events:
            last_push = push_events[0]
            return {
                "repo": last_push["repo"].get("name", "Unknown"),
                "date": last_push.get("created_at", "Unknown"),
                "commits": [commit["message"] for commit in last_push["payload"].get("commits", [])]
            }
        else:
            return {"error": "No recent push events found."}
    return {"error": f"GitHub API error {response.status_code}."}

# --- Repository Functions ---
def get_github_repos():
    """Fetch all repositories of the user."""
    url = f"{GITHUB_BASE_URL}{DEFAULT_GITHUB_USERNAME}/repos"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            repos = response.json()
            if not repos:
                return {"error": "No repositories found."}
            repo_names = [repo.get("name") for repo in repos]
            return {"repos": repo_names}
        elif response.status_code == 404:
            return {"error": "User not found. Check the username."}
        else:
            return {"error": f"GitHub API error {response.status_code}: {response.text}"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

def get_repo_stats(username, repo_name):
    """Fetch GitHub repository stats."""
    url = f"{GITHUB_REPOS_URL}{username}/{repo_name}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        return {
            "repo_name": data.get("name", "Unknown"),
            "stars": data.get("stargazers_count", 0),
            "forks": data.get("forks_count", 0),
            "watchers": data.get("watchers_count", 0),
            "open_issues": data.get("open_issues_count", 0),
            "language": data.get("language", "Unknown"),
            "repo_url": data.get("html_url", "Unknown"),
            "last_updated": data.get("updated_at", "Unknown")
        }
    return {"error": "Failed to fetch repo stats"}

def get_all_recent_commits():
    """Fetch latest commits from all repositories."""
    repos = get_github_repos_with_cache()
    if "error" in repos:
        return repos

    commits_summary = {}
    for repo in repos.get("repos", []):
        url = f"{GITHUB_REPOS_URL}{DEFAULT_GITHUB_USERNAME}/{repo}/commits"
        try:
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 200:
                commits = response.json()
                if not commits:
                    commits_summary[repo] = "No commits found."
                else:
                    latest_commit = commits[0]["commit"]
                    commits_summary[repo] = {
                        "message": latest_commit.get("message", ""),
                        "author": latest_commit["author"].get("name", "Unknown"),
                        "date": latest_commit["author"].get("date", "Unknown")
                    }
            elif response.status_code == 404:
                commits_summary[repo] = "Repository not found."
            else:
                commits_summary[repo] = f"GitHub API error {response.status_code}: {response.text}"
        except requests.exceptions.RequestException as e:
            commits_summary[repo] = f"Request failed: {str(e)}"
    return commits_summary

def get_repo_insights(username=DEFAULT_GITHUB_USERNAME):
    """Get insights like most starred, forked, and issues-prone repo."""
    repos = get_github_repos_with_cache()
    if "error" in repos:
        return repos

    repo_stats = []
    for repo in repos.get("repos", []):
        url = f"{GITHUB_REPOS_URL}{username}/{repo}"
        response = requests.get(url, headers=HEADERS).json()
        repo_stats.append({
            "name": repo,
            "stars": response.get("stargazers_count", 0),
            "forks": response.get("forks_count", 0),
            "issues": response.get("open_issues_count", 0),
        })

    most_starred = max(repo_stats, key=lambda x: x["stars"], default={})
    most_forked = max(repo_stats, key=lambda x: x["forks"], default={})
    most_issues = max(repo_stats, key=lambda x: x["issues"], default={})

    return {
        "most_starred_repo": most_starred,
        "most_forked_repo": most_forked,
        "most_issues_repo": most_issues,
    }

def get_languages_used(username=DEFAULT_GITHUB_USERNAME):
    """Get most used programming languages from GitHub repos."""
    repos = get_github_repos_with_cache()
    if "error" in repos:
        return repos

    language_stats = {}
    for repo in repos.get("repos", []):
        url = f"{GITHUB_REPOS_URL}{username}/{repo}/languages"
        response = requests.get(url, headers=HEADERS).json()
        for language, lines in response.items():
            language_stats[language] = language_stats.get(language, 0) + lines

    sorted_languages = sorted(language_stats.items(), key=lambda x: x[1], reverse=True)
    return {"languages": sorted_languages}



def get_open_issues(username=DEFAULT_GITHUB_USERNAME):
    """Fetch open issues for all repos."""
    repos = get_github_repos_with_cache()
    if "error" in repos:
        return repos

    issues_summary = {}
    for repo in repos.get("repos", []):
        url = f"{GITHUB_REPOS_URL}{username}/{repo}/issues"
        response = requests.get(url, headers=HEADERS).json()
        open_issues = [issue["title"] for issue in response if "pull_request" not in issue]
        if open_issues:
            issues_summary[repo] = open_issues
    return issues_summary if issues_summary else {"error": "No open issues found."}

def get_open_pull_requests(username=DEFAULT_GITHUB_USERNAME):
    """Fetch open pull requests for all repos."""
    repos = get_github_repos_with_cache()
    if "error" in repos:
        return repos

    pr_summary = {}
    for repo in repos.get("repos", []):
        url = f"{GITHUB_REPOS_URL}{username}/{repo}/pulls?state=open"
        response = requests.get(url, headers=HEADERS).json()
        if isinstance(response, list) and response:
            pr_summary[repo] = [
                {
                    "title": pr.get("title", "No title"),
                    "url": pr.get("html_url", "No URL")
                } for pr in response
            ]
    return pr_summary if pr_summary else {"error": "No open pull requests found."}

# --- Query Parsing & Formatting ---
def get_github_stats(query):
    """Understand user queries and fetch relevant GitHub data."""
    query = query.lower()

    if re.search(r"(github stats|profile|progress|overview)", query):
        return get_user_stats(DEFAULT_GITHUB_USERNAME)
    elif re.search(r"(repo|repository|repositories|list my repos)", query):
        return get_github_repos_with_cache()
    elif re.search(r"(commits|latest commit|recent commits|last update)", query):
        return get_all_recent_commits()
    elif re.search(r"(pull request|pr|open pr)", query):
        return get_open_pull_requests()
    elif re.search(r"(issues|bugs|problems in code)", query):
        return get_open_issues()
    elif re.search(r"(languages|language)", query):
        return get_languages_used()
    elif re.search(r"(contributions|commit count)", query):
        return get_contribution_stats()
    
    return {"error": "I couldn't understand your request. Try asking about GitHub stats, commits, PRs, or issues!"}

def format_commits(commits):
    """Format commit messages nicely."""
    formatted = "\n".join(
        [f"📌 Repo: {repo}\n💬 Message: {commit['message']}\n👤 By: {commit['author']} on {commit['date']}\n" 
         for repo, commit in commits.items() if isinstance(commit, dict)]
    )
    return formatted or "No recent commits found."

def format_repos(repos):
    """Format repository list nicely."""
    if "repos" in repos:
        return "📂 Your Repositories:\n" + "\n".join([f"🔹 {repo}" for repo in repos["repos"]])
    return "No repos found."

