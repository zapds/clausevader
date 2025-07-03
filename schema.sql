CREATE TABLE "user" (
    id INTEGER PRIMARY KEY NOT NULL,
    google_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    picture TEXT
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    expires_at INTEGER NOT NULL
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES "user"(id),
  filename TEXT,
  original_file_url TEXT,
  extracted_text TEXT,
  role TEXT CHECK (role IN ('recipient', 'issuer', 'unsure')),
  created_at TIMESTAMP DEFAULT now(),
  status TEXT CHECK (status IN ('processing', 'done', 'error')) DEFAULT 'processing',
  favourability_score INTEGER,
  title TEXT
);

CREATE TABLE clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  clause_text TEXT,
  summary TEXT,
  pros JSONB,
  cons JSONB,
  suggested_rewrite TEXT,
  sith_view TEXT,
  x FLOAT,
  y FLOAT,
  impact TEXT CHECK (impact IN ('favourable', 'neutral', 'unfavourable')),
  favorability_score INTEGER,
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES "user"(id),
  document_id UUID REFERENCES documents(id),
  user_message TEXT,
  ai_response TEXT,
  created_at TIMESTAMP DEFAULT now()
);