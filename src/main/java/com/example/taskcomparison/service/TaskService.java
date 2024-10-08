package com.example.taskcomparison.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TaskService {

    @Value("${api.download-url}")
    private String downloadUrl;

    @Value("${api.success-url}")
    private String successUrl;

    @Value("${api.error-url}")
    private String errorUrl;

    @Value("${api.progress-url}")
    private String progressUrl;

    @Value("${api.new-taskid-url}")
    private String newTaskIdUrl;

    private final AtomicInteger progress = new AtomicInteger(0);

    public String getTaskID(String taskID) {
        // 模拟返回数据
        return "Data for taskID: " + taskID;
    }

    public String getSuccess(String taskID) {
        // 模拟返回相同的success数据
        return "Success data for taskID: " + taskID;
    }

    public String getError(String taskID) {
        // 模拟返回不同的error数据
        return "Error data for taskID: " + taskID + " (original)\nError data for taskID: " + taskID + " (new)";
    }

    public Map<String, String> getNewTaskID(String taskID) {
        // 模拟返回新的taskID
        Map<String, String> response = new HashMap<>();
        response.put("newTaskID", taskID + "-new");
        return response;
    }

    public Map<String, Integer> getTaskPercent() {
        // 模拟返回进度百分比
        Map<String, Integer> response = new HashMap<>();
        response.put("percent", progress.get());
        return response;
    }

    public void resetProgress() {
        progress.set(0);
        new Thread(() -> {
            try {
                while (progress.get() < 100) {
                    Thread.sleep(1000);
                    progress.addAndGet(20);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public String getErrorUrl() {
        return errorUrl;
    }

    public String getProgressUrl() {
        return progressUrl;
    }

    public String getNewTaskIdUrl() {
        return newTaskIdUrl;
    }
}
