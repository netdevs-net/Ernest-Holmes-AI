import DatabaseManager from "./database";
import { v4 as uuidv4 } from "uuid";

export interface EmailRecord {
  id: string;
  email_address: string;
  message_content: string;
  message_id?: string;
  user_ip?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface EmailStats {
  total_emails: number;
  unique_emails: number;
  emails_today: number;
  emails_this_week: number;
  emails_this_month: number;
}

class EmailRepository {
  private db: any;

  constructor() {
    this.db = DatabaseManager.getInstance().getDatabase();
    this.initializeEmailTable();
  }

  private initializeEmailTable(): void {
    const emailTableSchema = `
      CREATE TABLE IF NOT EXISTS emails (
        id TEXT PRIMARY KEY,
        email_address TEXT NOT NULL,
        message_content TEXT NOT NULL,
        message_id TEXT,
        user_ip TEXT,
        user_agent TEXT,
        session_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_emails_email_address ON emails(email_address);
      CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
      CREATE INDEX IF NOT EXISTS idx_emails_message_id ON emails(message_id);
    `;

    try {
      this.db.exec(emailTableSchema);
      console.log("Email table schema initialized successfully");
    } catch (error) {
      console.error("Error initializing email table schema:", error);
      throw error;
    }
  }

  /**
   * Store an email address with message content
   */
  public storeEmail(
    emailAddress: string,
    messageContent: string,
    messageId?: string,
    userIp?: string,
    userAgent?: string,
    sessionId?: string,
  ): EmailRecord {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO emails (
        id, email_address, message_content, message_id, 
        user_ip, user_agent, session_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      stmt.run(
        id,
        emailAddress.toLowerCase().trim(),
        messageContent,
        messageId || null,
        userIp || null,
        userAgent || null,
        sessionId || null,
        now,
      );

      return {
        id,
        email_address: emailAddress.toLowerCase().trim(),
        message_content: messageContent,
        message_id: messageId,
        user_ip: userIp,
        user_agent: userAgent,
        session_id: sessionId,
        created_at: now,
      };
    } catch (error) {
      console.error("Error storing email:", error);
      throw new Error(
        `Failed to store email: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get email statistics
   */
  public getEmailStats(): EmailStats {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const weekAgo = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const monthAgo = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const totalEmails = this.db
        .prepare("SELECT COUNT(*) as count FROM emails")
        .get() as { count: number };

      const uniqueEmails = this.db
        .prepare("SELECT COUNT(DISTINCT email_address) as count FROM emails")
        .get() as { count: number };

      const emailsToday = this.db
        .prepare(
          "SELECT COUNT(*) as count FROM emails WHERE DATE(created_at) = ?",
        )
        .get(today) as { count: number };

      const emailsThisWeek = this.db
        .prepare("SELECT COUNT(*) as count FROM emails WHERE created_at >= ?")
        .get(weekAgo) as { count: number };

      const emailsThisMonth = this.db
        .prepare("SELECT COUNT(*) as count FROM emails WHERE created_at >= ?")
        .get(monthAgo) as { count: number };

      return {
        total_emails: totalEmails.count,
        unique_emails: uniqueEmails.count,
        emails_today: emailsToday.count,
        emails_this_week: emailsThisWeek.count,
        emails_this_month: emailsThisMonth.count,
      };
    } catch (error) {
      console.error("Error getting email stats:", error);
      throw new Error(
        `Failed to get email stats: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get recent emails (for admin dashboard)
   */
  public getRecentEmails(limit: number = 50): EmailRecord[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM emails 
        ORDER BY created_at DESC 
        LIMIT ?
      `);

      return stmt.all(limit) as EmailRecord[];
    } catch (error) {
      console.error("Error getting recent emails:", error);
      throw new Error(
        `Failed to get recent emails: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get emails by email address
   */
  public getEmailsByAddress(emailAddress: string): EmailRecord[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM emails 
        WHERE email_address = ? 
        ORDER BY created_at DESC
      `);

      return stmt.all(emailAddress.toLowerCase().trim()) as EmailRecord[];
    } catch (error) {
      console.error("Error getting emails by address:", error);
      throw new Error(
        `Failed to get emails by address: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Check if email address exists
   */
  public emailExists(emailAddress: string): boolean {
    try {
      const stmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM emails 
        WHERE email_address = ?
      `);

      const result = stmt.get(emailAddress.toLowerCase().trim()) as {
        count: number;
      };
      return result.count > 0;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }

  /**
   * Get email count by date range
   */
  public getEmailCountByDateRange(startDate: string, endDate: string): number {
    try {
      const stmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM emails 
        WHERE DATE(created_at) BETWEEN ? AND ?
      `);

      const result = stmt.get(startDate, endDate) as { count: number };
      return result.count;
    } catch (error) {
      console.error("Error getting email count by date range:", error);
      return 0;
    }
  }

  /**
   * Delete email record (for privacy compliance)
   */
  public deleteEmail(id: string): boolean {
    try {
      const stmt = this.db.prepare("DELETE FROM emails WHERE id = ?");
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting email:", error);
      return false;
    }
  }

  /**
   * Delete all emails for an email address (for privacy compliance)
   */
  public deleteEmailsByAddress(emailAddress: string): number {
    try {
      const stmt = this.db.prepare(
        "DELETE FROM emails WHERE email_address = ?",
      );
      const result = stmt.run(emailAddress.toLowerCase().trim());
      return result.changes;
    } catch (error) {
      console.error("Error deleting emails by address:", error);
      return 0;
    }
  }
}

export default EmailRepository;
