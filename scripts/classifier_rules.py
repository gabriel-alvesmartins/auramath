import os
import sys
import re
import json
import shutil
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR

ocr_engine = RapidOCR()

CATEGORIES = {
    "01_Onboarding_and_Welcome": {
        "01_Onboarding_Flow": [
            r"what do you want to learn", r"how did you hear", r"why are you learning",
            r"how much.*time", r"start from scratch", r"already know some",
            r"let's find your starting point", r"i want to learn", r"choose a language",
            r"welcome to duolingo", r"get started", r"free way to learn",
            r"how much.*know", r"i'm new to", r"i know some"
        ],
        "02_Learning_Goals": [
            r"commit to learning", r"streak goal", r"commit to my goal",
            r"likely to complete the course", r"earn \d+ gems", r"3 days", r"5 days", r"7 days",
            r"what's your daily learning goal", r"casual", r"regular", r"serious", r"intense"
        ],
        "03_First_Lesson": [
            r"let's get started", r"first lesson", r"placement test", r"starting test"
        ]
    },
    "02_Auth_and_Account": {
        "01_Login": [
            r"log in", r"sign in", r"enter your email", r"password", r"forgot password",
            r"sign in with apple", r"sign in with google", r"continue with facebook",
            r"already have an account"
        ],
        "02_Register_Create_Profile": [
            r"create profile", r"create your profile", r"how old are you",
            r"what's your name", r"what's your email", r"choose a password",
            r"create a profile", r"create profile later"
        ],
        "03_Phone_and_Password": [
            r"verify phone", r"phone number", r"verification code", r"enter code",
            r"6-digit", r"reset password", r"change password", r"new password",
            r"send instructions"
        ],
        "04_Logout_and_Delete_Account": [
            r"log out", r"logging out", r"are you sure you want to log out",
            r"delete account", r"deleting an account", r"permanently delete",
            r"erase.*data", r"confirm account deletion"
        ]
    },
    "03_Core_Lessons_and_Learning": {
        "02_Story_Lesson": [
            r"\bstory\b", r"\bstories\b", r"\bread story\b"
        ],
        "03_Radio_Lesson": [
            r"duolingo radio", r"\bradio lesson\b", r"radio", r"listen to the conversation"
        ],
        "04_Video_Call_Lesson": [
            r"video call", r"calling lily", r"incoming call", r"end call", r"call with lily"
        ],
        "05_Roleplay_AI_Max": [
            r"roleplay", r"ai partner", r"duolingo max", r"explain my answer"
        ],
        "06_Legendary_and_Guidebook": [
            r"legendary", r"prove you're a legend", r"unit guidebook", r"guidebook",
            r"key phrases", r"grammar notes", r"unit \d+ tips", r"section \d+", r"unit \d+"
        ],
        "01_Standard_Lesson": [
            r"translate this sentence", r"tap the matching pair", r"tap what you hear",
            r"fill in the blank", r"select the correct meaning", r"write this in",
            r"lesson complete", r"xp earned", r"combo bonus", r"perfect lesson",
            r"continue", r"check", r"correct", r"meaning of", r"type in english",
            r"complete the sentence", r"select \d+ words", r"repeat after", r"words you hear",
            r"in a row", r"\boops\b", r"solve the puzzle", r"captured my piece",
            r"words in your first week", r"practice speaking", r"listen"
        ]
    },
    "04_Specialized_Subjects": {
        "01_Math_Course": [
            r"\bmath\b", r"elementary math", r"intermediate math", r"brain training",
            r"multiplication", r"fraction", r"angle", r"geometry", r"calculate",
            r"addition", r"subtraction", r"division"
        ],
        "02_Music_Course": [
            r"\bmusic\b", r"piano", r"treble clef", r"practice songs", r"melody",
            r"notes", r"rhythm", r"tempo", r"c d e f g"
        ],
        "03_Chess_Course": [
            r"\bchess\b", r"chess\.com", r"checkmate", r"pawn", r"knight", r"bishop",
            r"rook", r"queen", r"king", r"play chess", r"oscar.*chess"
        ]
    },
    "05_Gamification_and_Streaks": {
        "02_Friend_Streaks": [
            r"friend streak", r"shared streak", r"streak together", r"invite.*streak",
            r"streak request", r"streak buddy"
        ],
        "01_Daily_Streaks": [
            r"day streak", r"streak freeze", r"streak society", r"keep your streak",
            r"streak active", r"streak repair", r"streak milestone", r"\bstreak\b"
        ],
        "03_Leaderboards_and_Leagues": [
            r"leaderboard", r"bronze league", r"silver league", r"gold league",
            r"sapphire league", r"ruby league", r"emerald league", r"amethyst league",
            r"pearl league", r"obsidian league", r"diamond league", r"promotion zone",
            r"demotion zone", r"tournament", r"top \d+ advance", r"leagues"
        ],
        "04_Quests_and_Badges": [
            r"daily quests", r"monthly badge", r"friends quest", r"complete \d+ quests",
            r"quest completed", r"quest chest", r"badges", r"\bquest\b"
        ],
        "05_Achievements": [
            r"achievements", r"wildfire", r"sage", r"scholar", r"champion",
            r"photogenic", r"conqueror", r"achievement unlocked"
        ],
        "06_Year_in_Review": [
            r"year in review", r"unwrapped", r"minutes learned", r"top 1%",
            r"your 2024", r"your 2025"
        ]
    },
    "06_Practice_and_Review": {
        "01_Practice_Hub": [
            r"practice hub", r"target practice", r"listen practice", r"speak practice",
            r"conversation practice"
        ],
        "02_Mistakes_Review": [
            r"review mistakes", r"mistakes inbox", r"fix mistakes", r"previous mistakes",
            r"\bmistakes\b"
        ],
        "03_Rapid_Review_Match_Madness": [
            r"rapid review", r"match madness", r"ramp up", r"lightning round",
            r"timed challenge"
        ],
        "04_Heart_Refill_Practice": [
            r"practice to earn hearts", r"practice for hearts", r"earn a heart",
            r"refill hearts"
        ]
    },
    "07_Super_and_Max_Subscriptions": {
        "02_Duolingo_Max_Paywalls": [
            r"duolingo max", r"\bmax\b.*subscription", r"upgrade to max",
            r"video call.*lily.*max", r"max family"
        ],
        "03_Family_Plan": [
            r"family plan", r"super family", r"super.*family", r"invite family",
            r"add up to 5", r"family members"
        ],
        "04_Manage_and_Cancel": [
            r"manage subscription", r"cancel subscription", r"canceling plan",
            r"keep my subscription", r"confirm cancellation", r"renewal"
        ],
        "01_Super_Duolingo_Paywalls": [
            r"super duolingo", r"try super", r"unlimited hearts", r"no ads",
            r"personalized practice", r"start 14-day free trial", r"annual plan",
            r"try for \$0", r"\bsuper\b"
        ]
    },
    "08_Shop_and_Gems": {
        "01_Shop_Main": [
            r"\bshop\b", r"\bgems\b", r"gem store", r"streak freeze.*gems",
            r"heart refill.*gems", r"timer boost.*gems", r"outfits"
        ],
        "02_Boosts_and_Gems": [
            r"purchase gems", r"timer boost", r"xp boost", r"double xp",
            r"timer boost activated"
        ]
    },
    "09_Social_and_Friends": {
        "01_Search_and_Follow_Friends": [
            r"search for friends", r"search friends", r"find contacts",
            r"find friends", r"connect to facebook", r"\bfollow\b", r"\bfollowing\b",
            r"\bfollowers\b", r"invite friends", r"invite code"
        ],
        "02_Nudges_and_Clash": [
            r"\bnudge\b", r"send a nudge", r"nudged", r"friends clash",
            r"clash", r"high five"
        ],
        "03_Activity_Feed_and_Reactions": [
            r"activity feed", r"\bfeed\b", r"congratulate", r"celebrated",
            r"friend updates", r"reacted to"
        ]
    },
    "10_Profile_and_Avatar": {
        "02_Avatar_Builder": [
            r"\bavatar\b", r"create avatar", r"skin tone", r"hairstyle",
            r"hair color", r"glasses", r"headwear", r"clothing", r"expressions"
        ],
        "03_Edit_Profile": [
            r"edit profile", r"change avatar", r"username", r"\bbio\b"
        ],
        "01_User_Profile": [
            r"weekly progress", r"@johnsmith", r"@matteo", r"joined \d{4}",
            r"courses.*following.*followers", r"\boverview\b", r"profile"
        ]
    },
    "11_Settings_and_System": {
        "02_Course_Management": [
            r"add a course", r"add course", r"remove course", r"courses.*settings",
            r"switch course", r"removing a course"
        ],
        "03_App_Icon_and_Dark_Mode": [
            r"app icon", r"streak icon", r"super icon", r"dark mode",
            r"light mode", r"appearance"
        ],
        "04_Notifications_and_Reminders": [
            r"reminders", r"notification settings", r"practice reminder",
            r"turn off notifications"
        ],
        "05_Duolingo_for_Schools": [
            r"duolingo for schools", r"classroom", r"teacher", r"join a classroom",
            r"classroom code"
        ],
        "06_Widgets_and_Live_Activities": [
            r"widgets", r"add widget", r"add-widget", r"home screen",
            r"dynamic island", r"live activities", r"lock screen"
        ],
        "01_App_Settings_and_Preferences": [
            r"settings", r"preferences", r"sound effects", r"haptic",
            r"speaking exercises", r"listening exercises"
        ]
    }
}

OUTLIER_PATTERNS = [
    r"spending bucket", r"checking account", r"credit card", r"routing number",
    r"mortgage", r"bank of america", r"chase bank", r"wells fargo", r"revolut",
    r"crypto", r"wallet"
]

def classify_text(text: str):
    clean_text = text.lower()
    
    # Check outlier first
    for pattern in OUTLIER_PATTERNS:
        if re.search(pattern, clean_text):
            return "_Review_and_Outliers", "Non_Duolingo_or_External"

    best_match = None
    best_score = 0

    for macro_cat, sub_flows in CATEGORIES.items():
        for sub_flow, patterns in sub_flows.items():
            score = 0
            for pattern in patterns:
                matches = re.findall(pattern, clean_text)
                score += len(matches) * 2
            
            if score > best_score:
                best_score = score
                best_match = (macro_cat, sub_flow)

    if best_match and best_score >= 2:
        return best_match
    
    # Fallback checks based on common UI tokens
    if any(k in clean_text for k in ["section", "unit", "lesson", "translate", "tap", "xp", "streak", "continue", "check", "sentence", "oops"]):
        return "03_Core_Lessons_and_Learning", "01_Standard_Lesson"
    if any(k in clean_text for k in ["profile", "follow", "joined", "followers", "following"]):
        return "10_Profile_and_Avatar", "01_User_Profile"
    if any(k in clean_text for k in ["super", "max", "unlimited", "free trial"]):
        return "07_Super_and_Max_Subscriptions", "01_Super_Duolingo_Paywalls"
    if any(k in clean_text for k in ["widget", "home screen"]):
        return "11_Settings_and_System", "06_Widgets_and_Live_Activities"

    return "_Review_and_Outliers", "Unclassified"

def process_image(img_path: Path):
    try:
        result, _ = ocr_engine(str(img_path))
        if not result:
            return "_Review_and_Outliers", "No_Text_Detected", ""
        text = " ".join([box[1] for box in result])
        macro_cat, sub_flow = classify_text(text)
        return macro_cat, sub_flow, text
    except Exception as e:
        return "_Review_and_Outliers", "Error_Processing", str(e)
