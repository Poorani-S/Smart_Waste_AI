import datetime
import sqlite3
import json
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        # We will create an sqlite database in the backend folder
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "smartwaste.db")
        self.connected = False
        try:
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            self.create_tables()
            self.connected = True
            print(f"Connected to SQLite database: {self.db_path}")
        except Exception as e:
            print(f"Failed to connect to SQLite: {e}")

    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_filename TEXT,
                category TEXT,
                confidence REAL,
                top_predictions TEXT,
                confidence_level TEXT,
                model_name TEXT,
                processing_time REAL,
                gradcam_path TEXT,
                timestamp DATETIME
            )
        ''')
        self.conn.commit()

    def insert_prediction(self, data):
        if not self.connected:
            return None
        cursor = self.conn.cursor()
        timestamp = datetime.datetime.utcnow().isoformat()
        top_predictions_json = json.dumps(data.get('top_predictions', []))
        
        cursor.execute('''
            INSERT INTO predictions (
                image_filename, category, confidence, top_predictions,
                confidence_level, model_name, processing_time, gradcam_path, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('image_filename'),
            data.get('category'),
            data.get('confidence'),
            top_predictions_json,
            data.get('confidence_level'),
            data.get('model_name'),
            data.get('processing_time'),
            data.get('gradcam_path'),
            timestamp
        ))
        self.conn.commit()
        return str(cursor.lastrowid)

    def get_predictions(self, skip=0, limit=20):
        if not self.connected:
            return []
        cursor = self.conn.cursor()
        cursor.execute('''
            SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ? OFFSET ?
        ''', (limit, skip))
        
        columns = [column[0] for column in cursor.description]
        results = []
        for row in cursor.fetchall():
            doc = dict(zip(columns, row))
            doc['_id'] = str(doc['id'])
            if 'top_predictions' in doc and doc['top_predictions']:
                try:
                    doc['top_predictions'] = json.loads(doc['top_predictions'])
                except:
                    doc['top_predictions'] = []
            results.append(doc)
        return results

    def get_total_count(self):
        if not self.connected:
            return 0
        cursor = self.conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM predictions')
        row = cursor.fetchone()
        return row[0] if row else 0

    def get_dashboard_stats(self):
        if not self.connected:
            return {}
        
        cursor = self.conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM predictions')
        total = cursor.fetchone()[0]
        
        cursor.execute('SELECT category, COUNT(*) FROM predictions GROUP BY category')
        categories = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.execute('SELECT confidence_level, COUNT(*) FROM predictions GROUP BY confidence_level')
        confidence_levels = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.execute('SELECT AVG(confidence) FROM predictions')
        avg_row = cursor.fetchone()
        avg_confidence = avg_row[0] if avg_row and avg_row[0] is not None else 0
        
        return {
            "total_predictions": total,
            "category_distribution": categories,
            "confidence_distribution": confidence_levels,
            "average_confidence": round(avg_confidence, 2)
        }

db = Database()
