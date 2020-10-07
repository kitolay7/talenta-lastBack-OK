
DROP PROCEDURE IF EXISTS CreateSequence;  

DELIMITER :)  
CREATE PROCEDURE CreateSequence( sSeqName VARCHAR(32), iSeqValue BIGINT )  
BEGIN
  CREATE TABLE IF NOT EXISTS SEQUENCES  
  (  
    NM_SEQUENCE VARCHAR(32) NOT NULL UNIQUE,  
    VR_SEQUENCE BIGINT      NOT NULL  
  );
  IF NOT EXISTS ( SELECT * FROM SEQUENCES WHERE (NM_SEQUENCE = sSeqName) ) THEN  
    INSERT INTO SEQUENCES (NM_SEQUENCE, VR_SEQUENCE)  
    VALUES (sSeqName   , iSeqValue  );  
  END IF;  
END :)  
DELIMITER ;

SET GLOBAL log_bin_trust_function_creators = 1;

DROP FUNCTION IF EXISTS GetSequenceVal;  

DELIMITER :)  
CREATE FUNCTION GetSequenceVal( sSeqName VARCHAR(32), iIncrement INTEGER )  
RETURNS BIGINT  -- iIncrement can be negative  
BEGIN  
  DECLARE iSeqValue BIGINT;  

  SELECT VR_SEQUENCE FROM SEQUENCES  
  WHERE  ( NM_SEQUENCE = sSeqName )  
  INTO   @iSeqValue;  

  IF ( iIncrement <> 0 ) THEN  
    SET @iSeqValue = @iSeqValue + iIncrement;  

    UPDATE SEQUENCES SET VR_SEQUENCE = @iSeqValue  
    WHERE  ( NM_SEQUENCE = sSeqName );  
  END IF;

  RETURN @iSeqValue;
END :)  
DELIMITER ;  
