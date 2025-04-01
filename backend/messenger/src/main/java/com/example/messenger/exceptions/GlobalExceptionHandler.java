package com.example.messenger.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final HttpStatus notFound = HttpStatus.NOT_FOUND;
    private final HttpStatus conflict = HttpStatus.CONFLICT;
    private final HttpStatus gone = HttpStatus.GONE;
    private final HttpStatus internalServerError = HttpStatus.INTERNAL_SERVER_ERROR;
    private final HttpStatus forbidden = HttpStatus.FORBIDDEN;

    @ExceptionHandler(value = {OperationNotAllowedException.class})
    public ResponseEntity<Object> handleOperationNotAllowedException(OperationNotAllowedException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                forbidden,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, forbidden);
    }

    @ExceptionHandler(value = {UserNotFoundException.class})
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = UserNameDTONotFoundException.class)
    public ResponseEntity<Object> handleUserNameDTONotFoundException(UserNameDTONotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = ProfilePictureNotFoundException.class)
    public ResponseEntity<Object> handleProfilePictureNotFoundException(ProfilePictureNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value =  {EmailAlreadyTakenException.class})
    public ResponseEntity<Object> handleEmailAlreadyTakenException(EmailAlreadyTakenException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                conflict,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, conflict);
    }

    @ExceptionHandler(value = {TokenNotFoundException.class})
    public ResponseEntity<Object> handleTokenNotFoundException(TokenNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {ConversationNotFoundException.class})
    public ResponseEntity<Object> handleConversationNotFoundException(ConversationNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {EmojiNotFoundException.class})
    public ResponseEntity<Object> handleEmojiNotFoundException(EmojiNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {ThemeNotFoundException.class})
    public ResponseEntity<Object> handleThemeNotFoundException(ThemeNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {ParticipantNotFoundException.class})
    public ResponseEntity<Object> handleParticipantNotFoundException(ParticipantNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {MessageNotFoundException.class})
    public ResponseEntity<Object> handleMessageNotFoundException(MessageNotFoundException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, notFound);
    }

    @ExceptionHandler(value = {TokenAlreadyConfirmedException.class})
    public ResponseEntity<Object> handleTokenAlreadyConfirmedException(TokenAlreadyConfirmedException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                conflict,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, conflict);
    }

    @ExceptionHandler(value = {TokenExpiredException.class})
    public ResponseEntity<Object> handleTokenExpiredException(TokenExpiredException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                gone,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, gone);
    }

    @ExceptionHandler(value = {FailedToSendEmailException.class})
    public ResponseEntity<Object> handleFailedToSendEmailException(FailedToSendEmailException e) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                e.getMessage(),
                internalServerError,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(exceptionResponse, internalServerError);
    }
}