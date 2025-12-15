/**
 * Script para implementar Lord Icons nos ícones do Jitsi Meet
 * Este script substitui dinamic    function replaceMicrophoneIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('🎤 Microfone já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/vycwlttg.json');
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);VG por Lord Icons
 */

(function() {
    'use strict';
    
    // Aguardar o carregamento completo da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLordIcons);
    } else {
        initLordIcons();
    }
    
    // Também tentar quando a página carrega completamente
    window.addEventListener('load', () => {
        setTimeout(initLordIcons, 2000);
    });
    
    function initLordIcons() {
        console.log('🎭 Iniciando Lord Icons...');
        
        // Aguardar o Jitsi Meet carregar completamente
        let attempts = 0;
        const maxAttempts = 20;
        
        function tryReplace() {
            attempts++;
            console.log(`🔄 Tentativa ${attempts} de ${maxAttempts}`);
            
            // Verificar se os elementos existem
            const audioPreview = document.querySelector('.audio-preview .toolbox-icon');
            const videoPreview = document.querySelector('.video-preview .toolbox-icon');
            
            if (audioPreview || videoPreview || attempts >= maxAttempts) {
                console.log('✅ Elementos encontrados ou limite atingido, iniciando substituição...');
                replacePreJoinIcons();
                observeIconChanges();
                
                // Tentar substituir ícones de fundo com delay adicional
                setTimeout(searchAndReplaceBackgroundIcons, 1000);
                setTimeout(searchAndReplaceBackgroundIcons, 3000);
                setTimeout(searchAndReplaceBackgroundIcons, 5000);
            } else {
                console.log('⏳ Aguardando elementos aparecerem...');
                setTimeout(tryReplace, 500);
            }
        }
        
        tryReplace();
    }
    
    function searchAndReplaceBackgroundIcons() {
        console.log('🔍 Procurando especificamente por ícones de fundo...');
        
        // Lista expandida de seletores para ícone de fundo
        const backgroundSelectors = [
            '[aria-label="Selecionar Fundo"]',
            '[aria-label*="Selecionar Fundo"]',
            '[title*="Selecionar Fundo"]',
            '[aria-label*="Virtual background"]',
            '[title*="Virtual background"]',
            '[aria-label*="Fundo virtual"]',
            '[title*="Fundo virtual"]',
            '.toolbox-icon[aria-label*="Selecionar"]',
            '.toolbox-button[aria-label*="Selecionar"]',
            'button[aria-label*="Selecionar"]',
            '[data-testid*="background"]',
            '[data-testid*="virtual"]',
            '.virtual-background-button',
            '.background-selection-button',
            // Seletores por conteúdo de texto
            'button:has-text("Selecionar Fundo")',
            'div:has-text("Selecionar Fundo")'
        ];
        
        let foundAny = false;
        backgroundSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`🎯 Encontrados ${elements.length} elementos com "${selector}"`);
                    elements.forEach((element, index) => {
                        // Verificar se é um botão de fundo
                        const ariaLabel = element.getAttribute('aria-label') || '';
                        const title = element.getAttribute('title') || '';
                        const isBackgroundButton = ariaLabel.includes('Selecionar') || ariaLabel.includes('Fundo') || 
                                                 ariaLabel.includes('Virtual') || ariaLabel.includes('background') ||
                                                 title.includes('Selecionar') || title.includes('Fundo') ||
                                                 title.includes('Virtual') || title.includes('background');
                        
                        if (isBackgroundButton) {
                            // Procurar o .toolbox-icon dentro do botão
                            const toolboxIcon = element.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceBackgroundIcon(toolboxIcon);
                                foundAny = true;
                                console.log(`🖼️ Ícone de fundo ${index + 1} substituído via busca adicional (${ariaLabel})`);
                            }
                        } else if (element.classList.contains('toolbox-icon') && !element.querySelector('.jitsi-lord-icon')) {
                            // Se o elemento já é um toolbox-icon, usar diretamente
                            replaceBackgroundIcon(element);
                            foundAny = true;
                            console.log(`🖼️ Ícone de fundo ${index + 1} substituído diretamente via busca adicional`);
                        }
                    });
                }
            } catch (error) {
                // Ignorar erros de seletores inválidos
            }
        });
        
        if (!foundAny) {
            console.log('🔍 Nenhum ícone de fundo encontrado na busca adicional');
        }
    }
    
    function replacePreJoinIcons() {
        console.log('🎬 Jitsi Lord Icons: Iniciando substituição dos ícones...');
        
        // Tentar vários seletores para encontrar os ícones
        const selectors = [
            '.audio-preview .toolbox-icon',
            '.video-preview .toolbox-icon', 
            '[data-testid="prejoin.audioMute"]',
            '[data-testid="prejoin.videoMute"]',
            '.prejoin-preview-dropdown-container .toolbox-icon',
            '.premeeting-screen .toolbox-icon'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Seletor "${selector}": ${elements.length} elementos encontrados`);
            
            elements.forEach((element, index) => {
                console.log(`📍 Elemento ${index + 1}:`, element);
                
                // Determinar tipo de ícone baseado no contexto
                if (selector.includes('audio') || element.closest('.audio-preview')) {
                    if (!element.querySelector('.jitsi-lord-icon')) {
                        replaceMicrophoneIcon(element);
                        console.log('🎤 Ícone de microfone substituído');
                    }
                } else if (selector.includes('video') || element.closest('.video-preview')) {
                    if (!element.querySelector('.jitsi-lord-icon')) {
                        replaceCameraIcon(element);
                        console.log('📹 Ícone de câmera substituído');
                    }
                }
            });
        });
        
        // Ícone de configurações - seletores específicos para evitar conflitos
        const settingsSelectors = [
            '[aria-label="Alternar configurações"]',
            '[aria-label*="Alternar configurações"]',
            '.toolbox-button[aria-label*="Alternar configurações"]',
            '[data-testid="prejoin.settings"]',
            '.welcome .welcome-page-settings .toolbox-icon',
            '.settings-button-container .toolbox-icon'
        ];

        // Seletores específicos para o ícone de fundo virtual
        const backgroundSelectors = [
            '[aria-label="Selecionar Fundo"]',
            '[aria-label*="Selecionar Fundo"]',
            '[title*="Selecionar Fundo"]',
            '[aria-label*="Virtual background"]',
            '[title*="Virtual background"]',
            '.toolbox-icon[aria-label*="Selecionar"]',
            '.toolbox-button[aria-label*="Selecionar"]',
            '[data-testid*="background"]',
            '.virtual-background-button',
            '.background-selection-button'
        ];

        // Procurar especificamente por botões de fundo
        backgroundSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de fundo "${selector}": ${elements.length} elementos`);
            elements.forEach((backgroundButton, index) => {
                if (backgroundButton) {
                    // Verificar se é realmente um botão de fundo
                    const ariaLabel = backgroundButton.getAttribute('aria-label') || '';
                    const title = backgroundButton.getAttribute('title') || '';
                    const isBackgroundButton = ariaLabel.includes('Selecionar') || ariaLabel.includes('Fundo') || 
                                             ariaLabel.includes('Virtual') || ariaLabel.includes('background') ||
                                             title.includes('Selecionar') || title.includes('Fundo') ||
                                             title.includes('Virtual') || title.includes('background');
                    
                    if (isBackgroundButton) {
                        // Procurar o .toolbox-icon DENTRO do botão
                        const toolboxIcon = backgroundButton.querySelector('.toolbox-icon');
                        if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                            replaceBackgroundIcon(toolboxIcon);
                            console.log(`🖼️ Ícone de fundo substituído (${selector}[${index}]):`, ariaLabel || title);
                        }
                    }
                }
            });
        });
        
        // Seletores específicos para o ícone de convite
        const inviteSelectors = [
            '[aria-label="Convidar pessoas"]',
            '[aria-label*="Convidar pessoas"]',
            '.toolbox-button[aria-label*="Convidar pessoas"]',
            '[aria-label*="Invite"]',
            '.toolbox-button[aria-label*="Invite"]'
        ];

        // Procurar especificamente por botões de convite
        inviteSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de convite "${selector}": ${elements.length} elementos`);
            elements.forEach((inviteButton, index) => {
                if (inviteButton) {
                    // Verificar se é realmente um botão de convite
                    const ariaLabel = inviteButton.getAttribute('aria-label') || '';
                    const title = inviteButton.getAttribute('title') || '';
                    const isInviteButton = ariaLabel.includes('Convidar') || ariaLabel.includes('pessoas') || 
                                         ariaLabel.includes('Invite') || title.includes('Invite') ||
                                         title.includes('Convidar');
                    
                    if (isInviteButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (inviteButton.classList.contains('toolbox-icon')) {
                            if (!inviteButton.querySelector('.jitsi-lord-icon')) {
                                replaceInviteIcon(inviteButton);
                                console.log(`👥 Ícone de convite substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = inviteButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceInviteIcon(toolboxIcon);
                                console.log(`👥 Ícone de convite substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Seletores específicos para o ícone de visualização em blocos
        const tileViewSelectors = [
            '[aria-label="Entrar na visualização em blocos"]',
            '[aria-label*="Entrar na visualização em blocos"]',
            '.toolbox-button[aria-label*="visualização em blocos"]',
            '[aria-label*="Tile view"]',
            '.toolbox-button[aria-label*="Tile view"]',
            '[aria-label*="Grid view"]',
            '.toolbox-button[aria-label*="Grid view"]'
        ];

        // Seletores específicos para o ícone de participantes
        const participantsSelectors = [
            '[aria-label="Participantes"]',
            '[aria-label*="Participantes"]',
            '.toolbox-button[aria-label*="Participantes"]',
            '[aria-label*="Participants"]',
            '.toolbox-button[aria-label*="Participants"]',
            '[aria-label*="People"]',
            '.toolbox-button[aria-label*="People"]'
        ];

        // Seletores específicos para o ícone de levantar a mão
        const raiseHandSelectors = [
            '[aria-label="Alternar levantar a mão"]',
            '[aria-label*="Alternar levantar a mão"]',
            '.toolbox-button[aria-label*="levantar a mão"]',
            '[aria-label*="Raise hand"]',
            '.toolbox-button[aria-label*="Raise hand"]',
            '[aria-label*="Toggle raise hand"]',
            '.toolbox-button[aria-label*="Toggle raise hand"]'
        ];

        // Seletores específicos para o ícone de chat
        const chatSelectors = [
            '[aria-label="Abrir chat"]',
            '[aria-label*="Abrir chat"]',
            '.toolbox-button[aria-label*="chat"]',
            '[aria-label*="Open chat"]',
            '.toolbox-button[aria-label*="Open chat"]',
            '[aria-label*="Toggle chat"]',
            '.toolbox-button[aria-label*="Toggle chat"]',
            '[aria-label*="Chat"]',
            '.toolbox-button[aria-label*="Chat"]'
        ];

        // Seletores específicos para o ícone de compartilhamento de tela
        const screenShareSelectors = [
            '[aria-label="Alternar compartilhamento de tela"]',
            '[aria-label*="Alternar compartilhamento de tela"]',
            '.toolbox-button[aria-label*="compartilhamento de tela"]',
            '[aria-label*="Toggle screen sharing"]',
            '.toolbox-button[aria-label*="Toggle screen sharing"]',
            '[aria-label*="Screen share"]',
            '.toolbox-button[aria-label*="Screen share"]',
            '[aria-label*="Share screen"]',
            '.toolbox-button[aria-label*="Share screen"]',
            '[aria-label*="compartilhar tela"]',
            '.toolbox-button[aria-label*="compartilhar tela"]'
        ];

        // Seletores específicos para o ícone de mais ações
        const moreActionsSelectors = [
            '[aria-label="Alternar mais menu de ações"]',
            '[aria-label*="Alternar mais menu de ações"]',
            '.toolbox-button[aria-label*="mais menu de ações"]',
            '[aria-label*="More actions"]',
            '.toolbox-button[aria-label*="More actions"]',
            '[aria-label*="Toggle more actions"]',
            '.toolbox-button[aria-label*="Toggle more actions"]',
            '[aria-label*="menu de ações"]',
            '.toolbox-button[aria-label*="menu de ações"]'
        ];

        // Procurar especificamente por botões de visualização em blocos
        tileViewSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de visualização em blocos "${selector}": ${elements.length} elementos`);
            elements.forEach((tileViewButton, index) => {
                if (tileViewButton) {
                    // Verificar se é realmente um botão de visualização em blocos
                    const ariaLabel = tileViewButton.getAttribute('aria-label') || '';
                    const title = tileViewButton.getAttribute('title') || '';
                    const isTileViewButton = ariaLabel.includes('visualização em blocos') || ariaLabel.includes('Tile view') || 
                                           ariaLabel.includes('Grid view') || title.includes('Tile view') ||
                                           title.includes('Grid view') || ariaLabel.includes('Entrar na visualização');
                    
                    if (isTileViewButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (tileViewButton.classList.contains('toolbox-icon')) {
                            if (!tileViewButton.querySelector('.jitsi-lord-icon')) {
                                replaceTileViewIcon(tileViewButton);
                                console.log(`🔲 Ícone de visualização em blocos substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = tileViewButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceTileViewIcon(toolboxIcon);
                                console.log(`🔲 Ícone de visualização em blocos substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Procurar especificamente por botões de participantes
        participantsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de participantes "${selector}": ${elements.length} elementos`);
            elements.forEach((participantsButton, index) => {
                if (participantsButton) {
                    // Verificar se é realmente um botão de participantes
                    const ariaLabel = participantsButton.getAttribute('aria-label') || '';
                    const title = participantsButton.getAttribute('title') || '';
                    const isParticipantsButton = ariaLabel.includes('Participantes') || ariaLabel.includes('Participants') || 
                                               ariaLabel.includes('People') || title.includes('Participants') ||
                                               title.includes('People') || title.includes('Participantes');
                    
                    if (isParticipantsButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (participantsButton.classList.contains('toolbox-icon')) {
                            if (!participantsButton.querySelector('.jitsi-lord-icon')) {
                                replaceParticipantsIcon(participantsButton);
                                console.log(`👥 Ícone de participantes substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = participantsButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceParticipantsIcon(toolboxIcon);
                                console.log(`👥 Ícone de participantes substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Procurar especificamente por botões de levantar a mão
        raiseHandSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de levantar a mão "${selector}": ${elements.length} elementos`);
            elements.forEach((raiseHandButton, index) => {
                if (raiseHandButton) {
                    // Verificar se é realmente um botão de levantar a mão
                    const ariaLabel = raiseHandButton.getAttribute('aria-label') || '';
                    const title = raiseHandButton.getAttribute('title') || '';
                    const isRaiseHandButton = ariaLabel.includes('levantar a mão') || ariaLabel.includes('Raise hand') || 
                                            ariaLabel.includes('Toggle raise hand') || title.includes('Raise hand') ||
                                            title.includes('levantar a mão') || title.includes('Alternar levantar');
                    
                    if (isRaiseHandButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (raiseHandButton.classList.contains('toolbox-icon')) {
                            if (!raiseHandButton.querySelector('.jitsi-lord-icon')) {
                                replaceRaiseHandIcon(raiseHandButton);
                                console.log(`✋ Ícone de levantar a mão substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = raiseHandButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceRaiseHandIcon(toolboxIcon);
                                console.log(`✋ Ícone de levantar a mão substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Procurar especificamente por botões de chat
        chatSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de chat "${selector}": ${elements.length} elementos`);
            elements.forEach((chatButton, index) => {
                if (chatButton) {
                    // Verificar se é realmente um botão de chat
                    const ariaLabel = chatButton.getAttribute('aria-label') || '';
                    const title = chatButton.getAttribute('title') || '';
                    const isChatButton = ariaLabel.includes('chat') || ariaLabel.includes('Chat') || 
                                       ariaLabel.includes('Abrir chat') || title.includes('chat') ||
                                       title.includes('Chat') || title.includes('Open chat');
                    
                    if (isChatButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (chatButton.classList.contains('toolbox-icon')) {
                            if (!chatButton.querySelector('.jitsi-lord-icon')) {
                                replaceChatIcon(chatButton);
                                console.log(`💬 Ícone de chat substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = chatButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceChatIcon(toolboxIcon);
                                console.log(`💬 Ícone de chat substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Procurar especificamente por botões de compartilhamento de tela
        screenShareSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de compartilhamento de tela "${selector}": ${elements.length} elementos`);
            elements.forEach((screenShareButton, index) => {
                if (screenShareButton) {
                    // Verificar se é realmente um botão de compartilhamento de tela
                    const ariaLabel = screenShareButton.getAttribute('aria-label') || '';
                    const title = screenShareButton.getAttribute('title') || '';
                    const isScreenShareButton = ariaLabel.includes('compartilhamento de tela') || ariaLabel.includes('Screen share') || 
                                              ariaLabel.includes('Share screen') || ariaLabel.includes('compartilhar tela') ||
                                              ariaLabel.includes('Toggle screen sharing') || title.includes('Screen share') ||
                                              title.includes('Share screen') || title.includes('compartilhar');
                    
                    if (isScreenShareButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (screenShareButton.classList.contains('toolbox-icon')) {
                            if (!screenShareButton.querySelector('.jitsi-lord-icon')) {
                                replaceScreenShareIcon(screenShareButton);
                                console.log(`🖥️ Ícone de compartilhamento de tela substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = screenShareButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceScreenShareIcon(toolboxIcon);
                                console.log(`🖥️ Ícone de compartilhamento de tela substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        // Procurar especificamente por botões de mais ações
        moreActionsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de mais ações "${selector}": ${elements.length} elementos`);
            elements.forEach((moreActionsButton, index) => {
                if (moreActionsButton) {
                    // Verificar se é realmente um botão de mais ações
                    const ariaLabel = moreActionsButton.getAttribute('aria-label') || '';
                    const title = moreActionsButton.getAttribute('title') || '';
                    const isMoreActionsButton = ariaLabel.includes('mais menu de ações') || ariaLabel.includes('More actions') || 
                                              ariaLabel.includes('Toggle more actions') || ariaLabel.includes('menu de ações') ||
                                              ariaLabel.includes('Alternar mais menu') || title.includes('More actions') ||
                                              title.includes('menu de ações') || title.includes('mais ações');
                    
                    if (isMoreActionsButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (moreActionsButton.classList.contains('toolbox-icon')) {
                            if (!moreActionsButton.querySelector('.jitsi-lord-icon')) {
                                replaceMoreActionsIcon(moreActionsButton);
                                console.log(`⚡ Ícone de mais ações substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = moreActionsButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceMoreActionsIcon(toolboxIcon);
                                console.log(`⚡ Ícone de mais ações substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
        
        settingsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Testando seletor de configurações "${selector}": ${elements.length} elementos`);
            elements.forEach((settingsButton, index) => {
                if (settingsButton) {
                    // Verificar se é realmente um botão de configurações
                    const ariaLabel = settingsButton.getAttribute('aria-label') || '';
                    const title = settingsButton.getAttribute('title') || '';
                    const isSettingsButton = ariaLabel.includes('Alternar') || ariaLabel.includes('configurações') || 
                                           ariaLabel.includes('settings') || title.includes('settings') ||
                                           title.includes('configurações');
                    
                    if (isSettingsButton) {
                        // Se é um .toolbox-icon diretamente, usar
                        if (settingsButton.classList.contains('toolbox-icon')) {
                            if (!settingsButton.querySelector('.jitsi-lord-icon')) {
                                replaceSettingsIcon(settingsButton);
                                console.log(`⚙️ Ícone de configurações substituído diretamente (${selector}[${index}]):`, ariaLabel || title);
                            }
                        } else {
                            // Procurar o .toolbox-icon DENTRO do botão  
                            const toolboxIcon = settingsButton.querySelector('.toolbox-icon');
                            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                replaceSettingsIcon(toolboxIcon);
                                console.log(`⚙️ Ícone de configurações substituído (${selector}[${index}]):`, ariaLabel || title);
                            }
                        }
                    }
                }
            });
        });
    }
    
    function replaceMicrophoneIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('🎤 Microfone já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se está mutado/desligado)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('🎤 Microfone - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/vycwlttg.json');
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Microfone mutado (desligado) - vermelho
            lordIcon.setAttribute('colors', 'primary:#e04757,secondary:#e04757');
            lordIcon.setAttribute('state', 'hover-cross');
        } else {
            // Microfone ativo (ligado) - branco
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
            lordIcon.removeAttribute('state');
        }
        
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (muted/unmuted)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('🎤 Microfone - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Microfone mutado (desligado) - vermelho
                        lordIcon.setAttribute('colors', 'primary:#e04757,secondary:#e04757');
                        lordIcon.setAttribute('state', 'hover-cross');
                    } else {
                        // Microfone ativo (ligado) - branco
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                        lordIcon.setAttribute('state', 'hover-recording');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
    }
    
    function replaceCameraIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('📹 Câmera já substituída, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se está desligada)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('📹 Câmera - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir ícone e cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Câmera desligada - ícone de câmera cortada e cor vermelha
            lordIcon.setAttribute('src', 'https://cdn.lordicon.com/wsaaegar.json');
            lordIcon.setAttribute('colors', 'primary:#e04757,secondary:#e04757');
            lordIcon.setAttribute('state', 'hover-cross');
        } else {
            // Câmera ligada - ícone de câmera normal e cor branca
            lordIcon.setAttribute('src', 'https://cdn.lordicon.com/wsaaegar.json');
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
            lordIcon.removeAttribute('state');
        }
        
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (on/off)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('📹 Câmera - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Câmera desligada - ícone de câmera cortada e cor vermelha
                        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/wsaaegar.json');
                        lordIcon.setAttribute('colors', 'primary:#e04757,secondary:#e04757');
                        lordIcon.setAttribute('state', 'hover-cross');
                    } else {
                        // Câmera ligada - ícone de câmera normal e cor branca
                        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/wsaaegar.json');
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                        lordIcon.setAttribute('state', 'hover-flash');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
    }
    
    function replaceSettingsIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('⚙️ Configurações já substituídas, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/lecprnjb.json');
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.setAttribute('stroke', 'bold');
        // Verificar estado inicial (se está toggled/desativado)
        const isInitiallyToggled = element.classList.contains('toggled');
        
        // Definir state baseado no estado inicial
        if (isInitiallyToggled) {
            // Configurações desativadas - usar hover-cross
            lordIcon.setAttribute('state', 'hover-cross');
        } else {
            // Configurações ativas - usar hover-recording
            lordIcon.setAttribute('state', 'hover-recording');
        }
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        console.log('⚙️ Lord Icon de configurações inserido com sucesso');
    }
    
    function replaceBackgroundIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('🖼️ Ícone de fundo já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon com ícone de imagem/fundo
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/cfoaotmk.json'); // Ícone de imagem/galeria
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        console.log('🖼️ Lord Icon de seleção de fundo inserido com sucesso');
    }
    
    function replaceInviteIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('👥 Ícone de convite já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon com ícone de convite
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/jdgfsfzr.json'); // Ícone de convite/adicionar pessoa
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        console.log('👥 Lord Icon de convite inserido com sucesso');
    }
    
    function replaceTileViewIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('🔲 Ícone de visualização em blocos já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon com ícone de visualização em blocos/grid
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/cfoaotmk.json'); // Ícone de grid/blocos
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        console.log('🔲 Lord Icon de visualização em blocos inserido com sucesso');
    }
    
    function replaceParticipantsIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('👥 Ícone de participantes já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Criar Lord Icon com ícone de participantes
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/kdduutaw.json'); // Ícone de participantes/pessoas
        lordIcon.setAttribute('trigger', 'hover');
        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        console.log('👥 Lord Icon de participantes inserido com sucesso');
    }
    
    function replaceRaiseHandIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('✋ Ícone de levantar a mão já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se a mão está levantada)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('✋ Levantar a mão - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon com ícone de levantar a mão
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/yepiihdb.json'); // Ícone de levantar a mão
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Mão levantada - cor laranja para destacar
            lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
        } else {
            // Mão não levantada - cor padrão azul
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        }
        
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (mão levantada/abaixada)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('✋ Levantar a mão - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Mão levantada - cor laranja para destacar
                        lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
                    } else {
                        // Mão não levantada - cor padrão azul
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
        
        console.log('✋ Lord Icon de levantar a mão inserido com sucesso');
    }
    
    function replaceChatIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('💬 Ícone de chat já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se o chat está ativo/aberto)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('💬 Chat - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon com ícone de chat
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/fozsorqm.json'); // Ícone de chat/mensagem
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Chat ativo/aberto - cor laranja para destacar
            lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
        } else {
            // Chat fechado - cor padrão azul
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        }
        
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (chat aberto/fechado)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('💬 Chat - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Chat ativo/aberto - cor laranja para destacar
                        lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
                    } else {
                        // Chat fechado - cor padrão azul
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
        
        console.log('💬 Lord Icon de chat inserido com sucesso');
    }
    
    function replaceScreenShareIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('🖥️ Ícone de compartilhamento de tela já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se o compartilhamento está ativo)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('🖥️ Compartilhamento de tela - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon com ícone de compartilhamento de tela
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/ldyubhgs.json'); // Ícone de compartilhamento de tela
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Compartilhamento ativo - cor laranja para destacar
            lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
        } else {
            // Compartilhamento inativo - cor padrão azul
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        }
        
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (compartilhamento ativo/inativo)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('🖥️ Compartilhamento de tela - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Compartilhamento ativo - cor laranja para destacar
                        lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
                    } else {
                        // Compartilhamento inativo - cor padrão azul
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
        
        console.log('🖥️ Lord Icon de compartilhamento de tela inserido com sucesso');
    }
    
    function replaceMoreActionsIcon(element) {
        // Verificar se já foi substituído
        if (element.querySelector('.jitsi-lord-icon')) {
            console.log('⚡ Ícone de mais ações já substituído, pulando...');
            return;
        }
        
        // Remover SVG existente
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.style.display = 'none';
        }
        
        // Verificar estado inicial (se o menu está ativo/aberto)
        const isInitiallyToggled = element.classList.contains('toggled');
        console.log('⚡ Mais ações - Estado inicial toggled:', isInitiallyToggled);
        
        // Criar Lord Icon com ícone de mais ações
        const lordIcon = document.createElement('lord-icon');
        lordIcon.setAttribute('src', 'https://cdn.lordicon.com/gvtjlyjf.json'); // Ícone de mais ações/menu
        lordIcon.setAttribute('trigger', 'hover');
        
        // Definir cores baseadas no estado inicial
        if (isInitiallyToggled) {
            // Menu ativo/aberto - cor laranja para destacar
            lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
        } else {
            // Menu fechado - cor padrão azul
            lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
        }
        
        lordIcon.setAttribute('stroke', 'bold');
        lordIcon.style.width = '24px';
        lordIcon.style.height = '24px';
        lordIcon.classList.add('jitsi-lord-icon');
        
        // Inserir o Lord Icon
        element.appendChild(lordIcon);
        
        // Observar mudanças de estado (menu aberto/fechado)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isToggled = element.classList.contains('toggled');
                    console.log('⚡ Mais ações - Mudança de estado, toggled:', isToggled);
                    
                    if (isToggled) {
                        // Menu ativo/aberto - cor laranja para destacar
                        lordIcon.setAttribute('colors', 'primary:#ff6b35,secondary:#ff6b35');
                    } else {
                        // Menu fechado - cor padrão azul
                        lordIcon.setAttribute('colors', 'primary:#0099ff,secondary:#429ee6');
                    }
                }
            });
        });
        
        observer.observe(element, { attributes: true });
        
        console.log('⚡ Lord Icon de mais ações inserido com sucesso');
    }
    
    function observeIconChanges() {
        // Observar mudanças no DOM para capturar novos ícones que possam aparecer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Verificar se novos ícones foram adicionados
                        const newAudioIcon = node.querySelector('.audio-preview .toolbox-icon');
                        const newVideoIcon = node.querySelector('.video-preview .toolbox-icon');
                        const newSettingsIcon = node.querySelector('.welcome .welcome-page-settings .toolbox-icon');
                        
                        // Procurar por múltiplos seletores de fundo
                        const backgroundSelectors = [
                            '[aria-label="Selecionar Fundo"]',
                            '[aria-label*="Selecionar Fundo"]',
                            '[aria-label*="Virtual background"]',
                            '.toolbox-icon[aria-label*="Selecionar"]',
                            '.toolbox-button[aria-label*="Selecionar"]'
                        ];
                        
                        if (newAudioIcon && !newAudioIcon.querySelector('.jitsi-lord-icon')) {
                            replaceMicrophoneIcon(newAudioIcon);
                        }
                        if (newVideoIcon && !newVideoIcon.querySelector('.jitsi-lord-icon')) {
                            replaceCameraIcon(newVideoIcon);
                        }
                        if (newSettingsIcon && !newSettingsIcon.querySelector('.jitsi-lord-icon')) {
                            replaceSettingsIcon(newSettingsIcon);
                        }
                        
                        // Seletores para configurações no observer
                        const settingsSelectors = [
                            '[aria-label="Alternar configurações"]',
                            '[aria-label*="Alternar configurações"]',
                            '.toolbox-button[aria-label*="Alternar configurações"]',
                            '.toolbox-button[aria-label*="configurações"]',
                            '.toolbox-button[aria-label*="settings"]'
                        ];
                        
                        settingsSelectors.forEach(selector => {
                            const newSettingsButton = node.querySelector(selector);
                            if (newSettingsButton) {
                                const ariaLabel = newSettingsButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('Alternar') || ariaLabel.includes('configurações') || ariaLabel.includes('settings')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newSettingsButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceSettingsIcon(toolboxIcon);
                                        console.log('⚙️ Novo ícone de configurações detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para convite no observer
                        const inviteSelectors = [
                            '[aria-label="Convidar pessoas"]',
                            '[aria-label*="Convidar pessoas"]',
                            '.toolbox-button[aria-label*="Convidar pessoas"]',
                            '.toolbox-button[aria-label*="Invite"]'
                        ];
                        
                        inviteSelectors.forEach(selector => {
                            const newInviteButton = node.querySelector(selector);
                            if (newInviteButton) {
                                const ariaLabel = newInviteButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('Convidar') || ariaLabel.includes('pessoas') || ariaLabel.includes('Invite')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newInviteButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceInviteIcon(toolboxIcon);
                                        console.log('👥 Novo ícone de convite detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para visualização em blocos no observer
                        const tileViewSelectors = [
                            '[aria-label="Entrar na visualização em blocos"]',
                            '[aria-label*="Entrar na visualização em blocos"]',
                            '.toolbox-button[aria-label*="visualização em blocos"]',
                            '.toolbox-button[aria-label*="Tile view"]'
                        ];
                        
                        tileViewSelectors.forEach(selector => {
                            const newTileViewButton = node.querySelector(selector);
                            if (newTileViewButton) {
                                const ariaLabel = newTileViewButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('visualização em blocos') || ariaLabel.includes('Tile view') || ariaLabel.includes('Entrar na visualização')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newTileViewButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceTileViewIcon(toolboxIcon);
                                        console.log('🔲 Novo ícone de visualização em blocos detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para participantes no observer
                        const participantsSelectors = [
                            '[aria-label="Participantes"]',
                            '[aria-label*="Participantes"]',
                            '.toolbox-button[aria-label*="Participantes"]',
                            '.toolbox-button[aria-label*="Participants"]'
                        ];
                        
                        participantsSelectors.forEach(selector => {
                            const newParticipantsButton = node.querySelector(selector);
                            if (newParticipantsButton) {
                                const ariaLabel = newParticipantsButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('Participantes') || ariaLabel.includes('Participants') || ariaLabel.includes('People')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newParticipantsButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceParticipantsIcon(toolboxIcon);
                                        console.log('👥 Novo ícone de participantes detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para levantar a mão no observer
                        const raiseHandSelectors = [
                            '[aria-label="Alternar levantar a mão"]',
                            '[aria-label*="Alternar levantar a mão"]',
                            '.toolbox-button[aria-label*="levantar a mão"]',
                            '.toolbox-button[aria-label*="Raise hand"]'
                        ];
                        
                        raiseHandSelectors.forEach(selector => {
                            const newRaiseHandButton = node.querySelector(selector);
                            if (newRaiseHandButton) {
                                const ariaLabel = newRaiseHandButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('levantar a mão') || ariaLabel.includes('Raise hand') || ariaLabel.includes('Toggle raise hand')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newRaiseHandButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceRaiseHandIcon(toolboxIcon);
                                        console.log('✋ Novo ícone de levantar a mão detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para chat no observer
                        const chatSelectors = [
                            '[aria-label="Abrir chat"]',
                            '[aria-label*="Abrir chat"]',
                            '.toolbox-button[aria-label*="chat"]',
                            '.toolbox-button[aria-label*="Chat"]'
                        ];
                        
                        chatSelectors.forEach(selector => {
                            const newChatButton = node.querySelector(selector);
                            if (newChatButton) {
                                const ariaLabel = newChatButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('chat') || ariaLabel.includes('Chat') || ariaLabel.includes('Abrir chat')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newChatButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceChatIcon(toolboxIcon);
                                        console.log('💬 Novo ícone de chat detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para compartilhamento de tela no observer
                        const screenShareSelectors = [
                            '[aria-label="Alternar compartilhamento de tela"]',
                            '[aria-label*="Alternar compartilhamento de tela"]',
                            '.toolbox-button[aria-label*="compartilhamento de tela"]',
                            '.toolbox-button[aria-label*="Screen share"]'
                        ];
                        
                        screenShareSelectors.forEach(selector => {
                            const newScreenShareButton = node.querySelector(selector);
                            if (newScreenShareButton) {
                                const ariaLabel = newScreenShareButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('compartilhamento de tela') || ariaLabel.includes('Screen share') || ariaLabel.includes('Share screen')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newScreenShareButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceScreenShareIcon(toolboxIcon);
                                        console.log('🖥️ Novo ícone de compartilhamento de tela detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Seletores para mais ações no observer
                        const moreActionsSelectors = [
                            '[aria-label="Alternar mais menu de ações"]',
                            '[aria-label*="Alternar mais menu de ações"]',
                            '.toolbox-button[aria-label*="mais menu de ações"]',
                            '.toolbox-button[aria-label*="More actions"]'
                        ];
                        
                        moreActionsSelectors.forEach(selector => {
                            const newMoreActionsButton = node.querySelector(selector);
                            if (newMoreActionsButton) {
                                const ariaLabel = newMoreActionsButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('mais menu de ações') || ariaLabel.includes('More actions') || ariaLabel.includes('menu de ações')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newMoreActionsButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceMoreActionsIcon(toolboxIcon);
                                        console.log('⚡ Novo ícone de mais ações detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                        
                        // Verificar todos os seletores de fundo no novo nó
                        backgroundSelectors.forEach(selector => {
                            const newBackgroundButton = node.querySelector(selector);
                            if (newBackgroundButton) {
                                const ariaLabel = newBackgroundButton.getAttribute('aria-label') || '';
                                if (ariaLabel.includes('Selecionar') || ariaLabel.includes('Fundo') || ariaLabel.includes('background')) {
                                    // Procurar o .toolbox-icon dentro do botão
                                    const toolboxIcon = newBackgroundButton.querySelector('.toolbox-icon');
                                    if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon')) {
                                        replaceBackgroundIcon(toolboxIcon);
                                        console.log('🖼️ Novo ícone de fundo detectado e substituído:', ariaLabel);
                                    }
                                }
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Função de debug
    function debugInfo() {
        console.log('🔍 DEBUG INFO:');
        console.log('📍 Document ready state:', document.readyState);
        console.log('📍 Lord Icon library loaded:', typeof window.lordicon !== 'undefined');
        
        const allToolboxIcons = document.querySelectorAll('.toolbox-icon');
        console.log('📍 Total toolbox icons found:', allToolboxIcons.length);
        
        allToolboxIcons.forEach((icon, index) => {
            console.log(`📍 Icon ${index + 1}:`, {
                classes: icon.className,
                parent: icon.parentElement?.className,
                ariaLabel: icon.getAttribute('aria-label'),
                title: icon.getAttribute('title'),
                hasLordIcon: !!icon.querySelector('.jitsi-lord-icon'),
                hasSvg: !!icon.querySelector('svg')
            });
        });
        
        // Procurar por data-testid
        const testIds = ['prejoin.audioMute', 'prejoin.videoMute', 'prejoin.settings'];
        testIds.forEach(testId => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            console.log(`📍 ${testId}:`, element ? 'found' : 'not found');
        });
        
        // Procurar especificamente por ícones de configurações
        console.log('🔍 CONFIGURAÇÕES DEBUG:');
        const allElements = document.querySelectorAll('*[class*="settings"], *[aria-label*="settings"], *[title*="settings"], *[class*="configurações"], *[aria-label*="Alternar configurações"], *[title*="configurações"]');
        console.log('⚙️ Elementos com "settings" encontrados:', allElements.length);
        allElements.forEach((el, i) => {
            console.log(`⚙️ Settings ${i + 1}:`, {
                tagName: el.tagName,
                className: el.className,
                ariaLabel: el.getAttribute('aria-label'),
                title: el.getAttribute('title'),
                hasToolboxIcon: !!el.querySelector('.toolbox-icon')
            });
        });
        
        // Procurar especificamente por ícones de fundo
        console.log('🔍 FUNDO/BACKGROUND DEBUG:');
        const backgroundElements = document.querySelectorAll('*[aria-label*="Selecionar"], *[aria-label*="Fundo"], *[aria-label*="background"], *[title*="Selecionar"], *[title*="Fundo"], *[title*="background"]');
        console.log('🖼️ Elementos com "fundo/background/selecionar" encontrados:', backgroundElements.length);
        backgroundElements.forEach((el, i) => {
            console.log(`🖼️ Background ${i + 1}:`, {
                tagName: el.tagName,
                className: el.className,
                ariaLabel: el.getAttribute('aria-label'),
                title: el.getAttribute('title'),
                textContent: el.textContent?.trim().substring(0, 30),
                hasLordIcon: !!el.querySelector('.jitsi-lord-icon'),
                hasSvg: !!el.querySelector('svg')
            });
        });
        
        // Procurar por elementos que contenham texto relacionado
        console.log('🔍 TEXTO DEBUG:');
        const allElementsWithText = Array.from(document.querySelectorAll('*')).filter(el => {
            const text = (el.textContent || '').toLowerCase();
            return text.includes('selecionar fundo') || text.includes('virtual background') || text.includes('fundo virtual');
        });
        console.log('📝 Elementos com texto relacionado a fundo:', allElementsWithText.length);
        allElementsWithText.forEach((el, i) => {
            console.log(`📝 Text ${i + 1}:`, {
                tagName: el.tagName,
                className: el.className,
                textSnippet: el.textContent?.trim().substring(0, 50)
            });
        });
    }

    function fixMisplacedIcons() {
        console.log('🔧 Procurando e corrigindo ícones mal posicionados...');
        
        // Procurar por Lord Icons que estão fora do .toolbox-icon
        const misplacedIcons = document.querySelectorAll('.toolbox-button > lord-icon.jitsi-lord-icon');
        console.log(`🎯 Encontrados ${misplacedIcons.length} ícones mal posicionados`);
        
        misplacedIcons.forEach((lordIcon, index) => {
            const toolboxButton = lordIcon.closest('.toolbox-button');
            const toolboxIcon = toolboxButton?.querySelector('.toolbox-icon');
            const buttonLabel = toolboxButton?.getAttribute('aria-label') || '';
            
            // Verificar se o ícone está no botão correto
            const isCorrectButton = buttonLabel.includes('Selecionar Fundo') || 
                                  buttonLabel.includes('Alternar configurações') ||
                                  buttonLabel.includes('Ativar som') ||
                                  buttonLabel.includes('Ativar câmera') ||
                                  buttonLabel.includes('Convidar pessoas') ||
                                  buttonLabel.includes('Invite') ||
                                  buttonLabel.includes('visualização em blocos') ||
                                  buttonLabel.includes('Tile view') ||
                                  buttonLabel.includes('Entrar na visualização') ||
                                  buttonLabel.includes('Participantes') ||
                                  buttonLabel.includes('Participants') ||
                                  buttonLabel.includes('People') ||
                                  buttonLabel.includes('levantar a mão') ||
                                  buttonLabel.includes('Raise hand') ||
                                  buttonLabel.includes('Alternar levantar') ||
                                  buttonLabel.includes('chat') ||
                                  buttonLabel.includes('Chat') ||
                                  buttonLabel.includes('Abrir chat') ||
                                  buttonLabel.includes('compartilhamento de tela') ||
                                  buttonLabel.includes('Screen share') ||
                                  buttonLabel.includes('Share screen') ||
                                  buttonLabel.includes('compartilhar tela') ||
                                  buttonLabel.includes('mais menu de ações') ||
                                  buttonLabel.includes('More actions') ||
                                  buttonLabel.includes('menu de ações');
            
            if (toolboxIcon && !toolboxIcon.querySelector('.jitsi-lord-icon') && isCorrectButton) {
                // Mover o Lord Icon para dentro do .toolbox-icon correto
                lordIcon.remove();
                toolboxIcon.appendChild(lordIcon);
                console.log(`🔧 Ícone ${index + 1} movido para posição correta (${buttonLabel})`);
            } else if (!isCorrectButton) {
                // Remover ícone de botão incorreto (como "Convidar pessoas")
                lordIcon.remove();
                console.log(`🗑️ Ícone ${index + 1} removido do botão incorreto (${buttonLabel})`);
            }
        });
        
        return misplacedIcons.length;
    }
    
    function cleanWrongIcons() {
        console.log('🧹 Limpando ícones em botões incorretos...');
        
        // Procurar especificamente por ícones em botões que não deveriam ter
        // Agora que o botão "Convidar pessoas" deve ter ícone, removemos da lista de "proibidos"
        const wrongButtons = [
            // Adicionar outros botões que não devem ter ícones se necessário
            // Por exemplo: '[aria-label*="Compartilhar tela"]'
        ];
        
        let cleaned = 0;
        wrongButtons.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                const wrongIcons = button.querySelectorAll('lord-icon.jitsi-lord-icon');
                wrongIcons.forEach(icon => {
                    icon.remove();
                    cleaned++;
                    console.log(`🗑️ Ícone removido do botão: ${button.getAttribute('aria-label')}`);
                });
            });
        });
        
        if (wrongButtons.length === 0) {
            console.log('✅ Nenhum botão configurado como "proibido". Todos os ícones estão permitidos.');
        }
        
        return cleaned;
    }

    // Exposar função global para debug
    window.jitsiLordIcons = {
        reinit: initLordIcons,
        replace: replacePreJoinIcons,
        debug: debugInfo,
        fix: fixMisplacedIcons,
        clean: cleanWrongIcons
    };
    
    console.log('🎭 Jitsi Lord Icons: Script carregado com sucesso!');
    console.log('💡 Para debug, execute: jitsiLordIcons.debug()');
})();