import os
import time
import json
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from .embedding_store import create_vector_store
import logging

logger = logging.getLogger(__name__)

class DataUpdateHandler(FileSystemEventHandler):
    """Handler for monitoring changes in the data directory"""
    
    def __init__(self, json_directory, persist_directory):
        self.json_directory = json_directory
        self.persist_directory = persist_directory
        self.last_update = time.time()
        self.update_delay = 2  # Wait 2 seconds before updating to batch multiple changes
        
    def on_modified(self, event):
        """Called when a file is modified"""
        if event.is_directory:
            return
            
        # Check if it's a JSON file in our data directory
        if event.src_path.endswith('.json') and 'data' in event.src_path:
            logger.info(f"📝 Data file modified: {event.src_path}")
            self._schedule_update()
    
    def on_created(self, event):
        """Called when a new file is created"""
        if event.is_directory:
            return
            
        if event.src_path.endswith('.json') and 'data' in event.src_path:
            logger.info(f"📄 New data file created: {event.src_path}")
            self._schedule_update()
    
    def on_deleted(self, event):
        """Called when a file is deleted"""
        if event.is_directory:
            return
            
        if event.src_path.endswith('.json') and 'data' in event.src_path:
            logger.info(f"🗑️ Data file deleted: {event.src_path}")
            self._schedule_update()
    
    def _schedule_update(self):
        """Schedule an update with delay to batch multiple changes"""
        current_time = time.time()
        self.last_update = current_time
        
        # Use a timer to delay the update
        import threading
        timer = threading.Timer(self.update_delay, self._update_embeddings)
        timer.start()
    
    def _update_embeddings(self):
        """Regenerate embeddings if enough time has passed"""
        if time.time() - self.last_update < self.update_delay:
            return  # Another change happened, skip this update
            
        try:
            logger.info("🔄 Regenerating embeddings due to data changes...")
            
            # Remove old vector store
            if os.path.exists(self.persist_directory):
                import shutil
                shutil.rmtree(self.persist_directory)
                logger.info("🗑️ Removed old vector store")
            
            # Create new vector store
            create_vector_store(
                json_directory=self.json_directory,
                chunk_size=512,
                overlap=120,
                persist_directory=self.persist_directory
            )
            
            logger.info("✅ Embeddings successfully regenerated!")
            
        except Exception as e:
            logger.error(f"❌ Error regenerating embeddings: {str(e)}")

class AutoUpdateVectorStore:
    """Main class for automatic vector store updates"""
    
    def __init__(self, json_directory="backend/data", persist_directory="backend/chroma_db"):
        self.json_directory = json_directory
        self.persist_directory = persist_directory
        self.observer = None
        self.handler = None
    
    def start_monitoring(self):
        """Start monitoring the data directory for changes"""
        try:
            self.handler = DataUpdateHandler(self.json_directory, self.persist_directory)
            self.observer = Observer()
            
            # Watch the data directory
            watch_path = Path(self.json_directory).parent  # Watch the parent to catch data dir changes
            self.observer.schedule(self.handler, str(watch_path), recursive=True)
            self.observer.start()
            
            logger.info(f"👀 Started monitoring {self.json_directory} for changes")
            logger.info("🔄 Embeddings will auto-update when data files change!")
            
        except Exception as e:
            logger.error(f"❌ Failed to start file monitoring: {str(e)}")
    
    def stop_monitoring(self):
        """Stop monitoring the data directory"""
        if self.observer:
            self.observer.stop()
            self.observer.join()
            logger.info("🛑 Stopped monitoring data directory")
    
    def force_update(self):
        """Manually trigger an embedding update"""
        if self.handler:
            logger.info("🔄 Manually triggering embedding update...")
            self.handler._update_embeddings()
        else:
            logger.error("❌ No handler available for manual update")

# Global instance for the main app
auto_updater = AutoUpdateVectorStore()

def start_auto_update():
    """Start the auto-update system"""
    auto_updater.start_monitoring()

def stop_auto_update():
    """Stop the auto-update system"""
    auto_updater.stop_monitoring()

def manual_update():
    """Manually trigger an update"""
    auto_updater.force_update()
