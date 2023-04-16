--------------------------------------------------------------------------------
-- Tables ----------------------------------------------------------------------
--------------------------------------------------------------------------------
CREATE TABLE address_searches (
  address_id  VARCHAR(64)   NOT NULL,
  ip          INET          NOT NULL,
  created     TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_searches (
  transaction_id  VARCHAR(64) NOT NULL,
  ip              INET        NOT NULL,
  created         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- Primary Keys ----------------------------------------------------------------
--------------------------------------------------------------------------------
ALTER TABLE address_searches      ADD CONSTRAINT pk_address_searches PRIMARY KEY (address_id, ip, created);
ALTER TABLE transaction_searches  ADD CONSTRAINT pk_transaction_searches PRIMARY KEY (transaction_id, ip, created);
