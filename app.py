from flask import Flask, render_template, request, redirect, url_for, session, flash
import requests
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import datetime

app = Flask(__name__)
cred = credentials.Certificate("hopesend-76e97-firebase-adminsdk-fbsvc-67e5789c0c.json")  # replace with your filename
firebase_admin.initialize_app(cred)
db = firestore.client()

FIREBASE_API_KEY = "AIzaSyAH8Bvn-7T0OarrSyztNi7Zd0yid_WiXgY"
app.secret_key = "super-secret-key"

def format_firestore_date(timestamp):
    """Convert Firestore Timestamp to formatted string"""
    if isinstance(timestamp, datetime.datetime):
        return timestamp.strftime("%b %d, %Y")
    return ""

@app.route('/')
def index():
    blogs_ref = db.collection('blogs').order_by('createdAt', direction=firestore.Query.DESCENDING).limit(5)
    latest_data_stories = []

    for doc in blogs_ref.stream():
        data = doc.to_dict()
        story = {
            "title": data.get("title", "Untitled"),
            "tagline": data.get("tagline", ""),
            "image": data.get("image", ""),  # e.g. static/images/story1.jpg
            "link": data.get("link", "#"),
            "author": data.get("author", "Isaac Salako"),
            "date": format_firestore_date(data.get("createdAt"))
        }
        latest_data_stories.append(story)
    return render_template('index.html', latest_data_stories=latest_data_stories)

@app.route('/blogs')
def blogs():
    blogs_ref = db.collection('blogs').order_by('createdAt', direction=firestore.Query.DESCENDING)
    all_blogs = [doc.to_dict() for doc in blogs_ref.stream()]
    return render_template('blogs.html', all_blogs=all_blogs)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

            payload = {
                "email": email,
                "password": password,
                "returnSecureToken": True
            }

            response = requests.post(url, json=payload)
            result = response.json()

            if "idToken" in result:
                session['user_uid'] = result['localId']
                session['user_email'] = result['email']
                return redirect(url_for('admin'))
            else:
                error_code = result.get("error", {}).get("message", "")
                friendly_message = "Login failed. Please try again."
                return render_template('admin_login.html', error=friendly_message)

        except Exception as e:
            print("Login error:", e)
            return render_template('admin_login.html', error="An unexpected error occurred.")

    return render_template('admin_login.html')

@app.route('/admin')
def admin():
    if not session.get('user_uid'):
        return redirect(url_for('login'))
    return render_template('admin_dashboard.html')

# BLOGS
@app.route('/add_blog', methods=['POST'])
def add_blog():
    if not session.get('user_uid'):
        return redirect(url_for('login'))

    title = request.form.get('blogTitle')
    tagline = request.form.get('blogTagline')
    image = request.form.get('blogImage')
    link = request.form.get('blogLink')

    db.collection('blogs').add({
        'title': title,
        'tagline': tagline,
        'image': image,
        'link': link,
        'createdAt': firestore.SERVER_TIMESTAMP
    })

    flash('Blog added successfully!', 'success')
    return redirect(url_for('admin'))

@app.route('/add_link', methods=['POST'])
def add_link():
    if not session.get('user_uid'):
        return redirect(url_for('login'))

    title = request.form.get('linkTitle')
    url_link = request.form.get('linkUrl')
    description = request.form.get('linkDescription')

    db.collection('links').add({
        'title': title,
        'url': url_link,
        'description': description,
        'createdAt': firestore.SERVER_TIMESTAMP
    })

    flash('Link added successfully!', 'success')
    return redirect(url_for('admin'))

@app.route('/add_video', methods=['POST'])
def add_video():
    if not session.get('user_uid'):
        return redirect(url_for('login'))

    title = request.form.get('videoTitle')
    video_url = request.form.get('videoUrl')

    db.collection('videos').add({
        'title': title,
        'videoUrl': video_url,
        'createdAt': firestore.SERVER_TIMESTAMP
    })

    flash('Video added successfully!', 'success')
    return redirect(url_for('admin'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

#if __name__ == '__main__':
 #   app.run(debug=True)